import { streamText, tool, stepCountIs } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { retrieveContext } from '@datalib/hackbot/getHackbotContext';
import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import { auth } from '@/auth';
import {
  parseRawDate,
  formatEventDateTime,
  formatEventTime,
} from '@utils/hackbot/eventFormatting';
import {
  isEventRecommended,
  isEventRelevantToProfile,
  applyTimeFilter,
} from '@utils/hackbot/eventFiltering';
import type { HackerProfile } from '@typeDefs/hackbot';
import { getPageContext, buildSystemPrompt } from '@utils/hackbot/systemPrompt';

const MAX_USER_MESSAGE_CHARS = 200;
const MAX_HISTORY_MESSAGES = 10;

const fewShotExamples = [
  {
    role: 'user' as const,
    content: 'When does hacking end?',
  },
  {
    role: 'assistant' as const,
    content: 'Hacking ends on Sunday, April 20 at 11:00 AM Pacific Time.',
  },
  {
    role: 'user' as const,
    content: 'What workshops are today?',
  },
  {
    role: 'assistant' as const,
    content: "Here are today's workshops!",
  },
  {
    role: 'user' as const,
    content: "What's happening right now?",
  },
  {
    role: 'assistant' as const,
    content: "Here's what's going on right now!",
  },
  {
    role: 'user' as const,
    content: 'What prize tracks should I enter?',
  },
  {
    role: 'assistant' as const,
    content: "Here are some prize tracks I'd recommend for you!",
  },
];

export async function POST(request: Request) {
  try {
    const { messages, currentPath } = await request.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: 'Invalid request' }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1];

    if (lastMessage.role !== 'user') {
      return Response.json(
        { error: 'Last message must be from user.' },
        { status: 400 }
      );
    }

    if (lastMessage.content.length > MAX_USER_MESSAGE_CHARS) {
      return Response.json(
        {
          error: `Message too long. Please keep it under ${MAX_USER_MESSAGE_CHARS} characters.`,
        },
        { status: 400 }
      );
    }

    // Greetings don't need knowledge context — skip the embedding round-trip.
    const isSimpleGreeting =
      /^(hi|hello|hey|thanks|thank you|ok|okay)\b/i.test(
        lastMessage.content.trim()
      );

    // Run auth and context retrieval in parallel to save ~400 ms.
    let session;
    let docs;
    try {
      [session, { docs }] = await Promise.all([
        auth(),
        isSimpleGreeting
          ? Promise.resolve({ docs: [] })
          : retrieveContext(lastMessage.content),
      ]);
    } catch (e) {
      console.error('[hackbot][stream] Context retrieval error', e);
      return Response.json(
        { error: 'Search backend unavailable. Please contact an organizer.' },
        { status: 500 }
      );
    }

    // Build profile from session (after auth resolves)
    const sessionUser = (session as any)?.user as any;
    const profile: HackerProfile | null = sessionUser
      ? {
          name: sessionUser.name ?? undefined,
          position: sessionUser.position ?? undefined,
          is_beginner: sessionUser.is_beginner ?? undefined,
        }
      : null;
    console.log(
      `[hackbot][stream] message="${lastMessage.content?.slice(0, 80)}" name=${
        profile?.name ?? 'n/a'
      } position=${profile?.position ?? 'n/a'} beginner=${
        profile?.is_beginner ?? 'n/a'
      } path=${currentPath ?? '/'}`
    );

    const contextSummary =
      docs && docs.length > 0
        ? docs
            .map((d, index) => {
              const header = `${index + 1}) [type=${d.type}, title="${
                d.title
              }"${d.url ? `, url="${d.url}"` : ''}]`;
              return `${header}\n${d.text}`;
            })
            .join('\n\n')
        : 'No additional knowledge context found.';

    const pageContext = getPageContext(currentPath);
    const systemPrompt = buildSystemPrompt({ profile, pageContext });

    const chatMessages = [
      { role: 'system', content: systemPrompt },
      ...fewShotExamples,
      {
        role: 'system',
        content: `Knowledge context about HackDavis (rules, submission, judging, tracks, general info):\n\n${contextSummary}`,
      },
      ...messages.slice(-MAX_HISTORY_MESSAGES),
    ];

    const model = process.env.OPENAI_MODEL || 'gpt-5-mini';
    const maxOutputTokens = parseInt(
      process.env.OPENAI_MAX_TOKENS || '600',
      10
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = streamText({
      model: openai(model) as any,
      messages: chatMessages.map((m: any) => ({
        role: m.role as 'system' | 'user' | 'assistant',
        content: m.content,
      })),
      maxOutputTokens,
      // Custom stop condition: hard limit of 5 steps, but also stop immediately
      // after any step where provide_links was the ONLY tool called AND text has
      // already been generated in some step — preventing an extra LLM round-trip
      // just to "acknowledge" the link annotation (saves ~2 s per response).
      // We require prior text so we never stop before the LLM has responded.
      stopWhen: (state: any) => {
        const { steps } = state as { steps: any[] };
        if (stepCountIs(5)({ steps })) return true;
        if (!steps.length) return false;
        const toolCalls: any[] = steps[steps.length - 1].toolCalls ?? [];
        const onlyProvideLinks =
          toolCalls.length > 0 &&
          toolCalls.every((t: any) => t.toolName === 'provide_links');
        if (!onlyProvideLinks) return false;
        // Only short-circuit if the LLM has actually produced some answer text
        return steps.some((s: any) => (s.text ?? '').trim().length > 0);
      },
      providerOptions: {
        openai: { reasoningEffort: 'low' },
      },
      tools: {
        get_events: tool({
          description:
            'Fetch the live HackDavis event schedule from the database. Use this for ANY question about event times, locations, schedule, or what is happening when.',
          inputSchema: z.object({
            type: z
              .string()
              .nullable()
              .describe(
                'Filter by event type: WORKSHOPS, MEALS, ACTIVITIES, or GENERAL. Pass null to include all types.'
              ),
            search: z
              .string()
              .nullable()
              .describe(
                'Case-insensitive text search on event name (e.g. "dinner", "opening ceremony", "team"). Pass null for no search filter.'
              ),
            limit: z
              .number()
              .nullable()
              .describe(
                'Max number of events to return — use when only 1-3 results are expected. Pass null for no limit.'
              ),
            forProfile: z
              .boolean()
              .nullable()
              .describe(
                "When true, filters results to only events relevant to the hacker's role/experience (beginner, developer, designer, pm). Events with no role tags are always included. Use this for personalised recommendations. Pass null to skip."
              ),
            timeFilter: z
              .enum(['today', 'now', 'upcoming', 'past'])
              .nullable()
              .describe(
                'Filter events by time: "today" = starts today, "now" = currently live, "upcoming" = starts within 3 hours, "past" = already ended. Pass null for no time filter.'
              ),
            include_activities: z
              .boolean()
              .nullable()
              .describe(
                'Allow ACTIVITIES-type events in results. Set to true ONLY when the user is explicitly asking about social/fun activities to attend. NEVER set this for prize track questions, knowledge questions, or workshop queries. Pass null or false otherwise.'
              ),
          }),
          execute: async ({
            type,
            search,
            limit,
            forProfile,
            timeFilter,
            include_activities,
          }) => {
            try {
              const db = await getDatabase();
              const query: Record<string, unknown> = {};
              if (type) query.type = { $regex: type, $options: 'i' };
              if (search) query.name = { $regex: search, $options: 'i' };

              const events = await db
                .collection('events')
                .find(query)
                .sort({ start_time: 1 })
                .toArray();

              // Block ACTIVITIES unless explicitly opted in
              const typeFiltered = include_activities
                ? events
                : events.filter(
                    (ev: any) => (ev.type ?? '').toUpperCase() !== 'ACTIVITIES'
                  );

              // Apply time filter first (before profile and limit)
              const timeFiltered = timeFilter
                ? applyTimeFilter(typeFiltered, timeFilter)
                : typeFiltered;

              const profileFiltered =
                forProfile && profile
                  ? timeFiltered.filter((ev: any) =>
                      isEventRelevantToProfile(ev, profile)
                    )
                  : timeFiltered;

              // Apply limit after all filters
              const limited = limit
                ? profileFiltered.slice(0, limit)
                : profileFiltered;

              if (!limited.length) {
                return { events: [], message: 'No events found.' };
              }

              const formatted = limited.map((ev: any) => {
                const startDate = parseRawDate(ev.start_time);
                const endDate = parseRawDate(ev.end_time);
                // Always show only the time for the end (start already shows the date)
                const endFormatted = endDate ? formatEventTime(endDate) : null;
                return {
                  id: String(ev._id),
                  name: String(ev.name || 'Event'),
                  type: ev.type || null,
                  start: startDate ? formatEventDateTime(ev.start_time) : null,
                  end: endFormatted,
                  startMs: startDate?.getTime() ?? null,
                  location: ev.location || null,
                  host: ev.host || null,
                  tags: Array.isArray(ev.tags) ? ev.tags : [],
                  isRecommended: isEventRecommended(ev, profile),
                };
              });

              console.log(
                `[hackbot][stream][tool] get_events returned ${formatted.length} events`
              );
              return { events: formatted };
            } catch (e) {
              console.error('[hackbot][stream][tool] get_events error', e);
              return {
                events: [],
                message:
                  'Could not fetch events. Please check the schedule page.',
              };
            }
          },
        }),
        provide_links: tool({
          description:
            'Surface 1-3 relevant links from the knowledge context for the user. Call this AFTER generating your full text response — never before. Skip it entirely for greetings, off-topic refusals, and pure event-schedule answers (event cards already carry links).',
          inputSchema: z.object({
            links: z
              .array(
                z.object({
                  label: z
                    .string()
                    .describe(
                      'Short user-friendly label. Strip prefixes like "FAQ:", "Prize Track:", "Starter Kit:". Max 40 chars.'
                    ),
                  url: z
                    .string()
                    .describe(
                      'URL exactly as it appears in the knowledge context.'
                    ),
                })
              )
              .max(3)
              .describe(
                '1-3 links most relevant to the response. Omit any that are only loosely related.'
              ),
          }),
          execute: async ({ links }) => ({ links }),
        }),
      },
    });

    // Build a custom stream using the old Data Stream Protocol format so the
    // existing widget parser (0: text, 8: annotations, a: tool results) works
    // without any client-side changes after the ai@5 upgrade.
    //
    // Read baseStream directly instead of fullStream to avoid the tee deadlock:
    // fullStream calls teeStream() which creates an unread second stream that
    // fills up and back-pressures the whole pipeline, stalling after ~2 events.
    // baseStream emits { part, partialOutput } objects; we extract `part`.
    //
    // We use a TransformStream + background producer instead of a pull-based
    // ReadableStream so that the HTTP response starts flowing immediately while
    // the background task drives the LLM pipeline independently.
    const enc = new TextEncoder();
    const { readable, writable } = new TransformStream<
      Uint8Array,
      Uint8Array
    >();
    const writer = writable.getWriter();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bs = (result as any).baseStream as ReadableStream<{
      part: any;
      partialOutput: any;
    }>;

    (async () => {
      try {
        // (Links are surfaced via the provide_links tool result in `a:` events)

        const reader = bs.getReader();
        // eslint-disable-next-line no-constant-condition
        while (true) {
          // eslint-disable-next-line no-await-in-loop
          const { done, value } = await reader.read();
          if (done) break;
          const part = value?.part;
          if (part?.type === 'text-delta') {
            // eslint-disable-next-line no-await-in-loop
            await writer.write(enc.encode(`0:${JSON.stringify(part.text)}\n`));
          } else if (part?.type === 'tool-result') {
            // eslint-disable-next-line no-await-in-loop
            await writer.write(
              enc.encode(
                `a:${JSON.stringify([
                  {
                    toolCallId: part.toolCallId,
                    toolName: part.toolName,
                    state: 'result',
                    result: part.output,
                  },
                ])}\n`
              )
            );
          }
        }
        await writer.close();
      } catch (e) {
        console.error('[hackbot][stream] baseStream error', e);
        try {
          await writer.abort(e as Error);
        } catch {
          // ignore abort error
        }
      }
    })();

    const stream = readable;

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (error: any) {
    console.error('[hackbot][stream] Error', error);

    if (error.status === 429) {
      return Response.json(
        { error: 'Too many requests. Please wait a moment and try again.' },
        { status: 429 }
      );
    }

    if (error.status === 401 || error.message?.includes('API key')) {
      return Response.json(
        {
          error: 'AI service configuration error. Please contact an organizer.',
        },
        { status: 500 }
      );
    }

    return Response.json(
      { error: 'Something went wrong. Please try again in a moment.' },
      { status: 500 }
    );
  }
}
