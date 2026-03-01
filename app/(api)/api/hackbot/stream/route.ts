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
  getLADateString,
} from '@utils/hackbot/eventFormatting';
import {
  isEventRecommended,
  isEventRelevantToProfile,
  applyTimeFilter,
} from '@utils/hackbot/eventFiltering';
import type { HackerProfile } from '@typeDefs/hackbot';
import { getPageContext, buildSystemPrompt } from '@utils/hackbot/systemPrompt';

const MAX_USER_MESSAGE_CHARS = 200;
const MAX_HISTORY_MESSAGES = 6;

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
    const isSimpleGreeting = /^(hi|hello|hey|thanks|thank you|ok|okay)\b/i.test(
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

    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
    const configuredMaxTokens = parseInt(
      process.env.OPENAI_MAX_TOKENS || '600',
      10
    );
    // Reasoning models (o1, o3, o4-mini, gpt-5*) use max_completion_tokens which
    // includes BOTH reasoning tokens and output tokens. If the budget is too low,
    // reasoning consumes all tokens and no visible text is produced. Auto-scale to
    // at least 4000 so reasoning has headroom alongside the actual response.
    const isReasoningModel =
      /^(o1|o3|o4-mini|gpt-5(?!-chat))/.test(model) ||
      model.startsWith('codex-mini') ||
      model.startsWith('computer-use-preview');
    const maxOutputTokens = isReasoningModel
      ? Math.max(configuredMaxTokens, 4000)
      : configuredMaxTokens;
    console.log(`[hackbot][stream] model=${model} isReasoning=${isReasoningModel} maxOutputTokens=${maxOutputTokens}`);

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
                "When true, filters results to only events relevant to the logged-in hacker's own role/experience. Use ONLY when the user is asking about their own events ('what should I attend?'). Do NOT use when asking about a different role (use the tags filter instead). Pass null to skip."
              ),
            timeFilter: z
              .enum([
                'today',
                'now',
                'upcoming',
                'past',
                'morning',
                'afternoon',
                'evening',
                'night',
              ])
              .nullable()
              .describe(
                'Filter events by time: "today" = starts today, "now" = currently live, "upcoming" = starts within 3 hours, "past" = already ended. Time-of-day (LA timezone): "morning" = 6 AM–noon, "afternoon" = noon–5 PM, "evening" = 5–9 PM, "night" = 9 PM–6 AM. Pass null for no time filter.'
              ),
            include_activities: z
              .boolean()
              .nullable()
              .describe(
                'Allow ACTIVITIES-type events in results. Set to true ONLY when the user is explicitly asking about social/fun activities to attend. NEVER set this for prize track questions, knowledge questions, or workshop queries. Pass null or false otherwise.'
              ),
            tags: z
              .array(z.string())
              .nullable()
              .describe(
                'Filter events that have ALL of the specified tags (e.g. ["designer"] to find designer-tagged workshops, ["beginner"] for beginner events). Use this when the user asks about role-specific workshops for a role that may differ from their own profile. Pass null for no tag filter.'
              ),
            date: z
              .string()
              .nullable()
              .describe(
                'Filter events starting on a specific date (YYYY-MM-DD in LA timezone). Use for date-specific queries ("second day", "Sunday", "May 10"). Compute the date from the current time context in the system prompt. Pass null for no date filter.'
              ),
          }),
          execute: async ({
            type,
            search,
            limit,
            forProfile,
            timeFilter,
            include_activities,
            tags,
            date,
          }) => {
            console.log('[hackbot][stream][tool] get_events input', {
              type, search, limit, forProfile, timeFilter, include_activities, tags, date,
            });
            try {
              const db = await getDatabase();
              const query: Record<string, unknown> = {};
              if (type) query.type = { $regex: type, $options: 'i' };
              if (search) query.name = { $regex: search, $options: 'i' };
              if (tags && tags.length > 0)
                query.tags = { $all: tags.map((t) => t.toLowerCase()) };

              const events = await db
                .collection('events')
                .find(query)
                .sort({ start_time: 1 })
                .toArray();

              // Date filter (post-fetch, LA timezone)
              const dateFiltered = date
                ? events.filter((ev: any) => {
                    const start = parseRawDate(ev.start_time);
                    return start && getLADateString(start) === date;
                  })
                : events;

              // Block ACTIVITIES unless explicitly opted in
              const typeFiltered = include_activities
                ? dateFiltered
                : dateFiltered.filter(
                    (ev: any) => (ev.type ?? '').toUpperCase() !== 'ACTIVITIES'
                  );

              // When filtering by a specific exclusive role tag (designer/developer/pm),
              // exclude events also tagged for other exclusive roles — those are general
              // events for all roles, not role-specific workshops.
              const EXCLUSIVE_ROLE_TAGS = new Set([
                'developer',
                'designer',
                'pm',
              ]);
              const requestedExclusive = (tags ?? [])
                .map((t) => t.toLowerCase())
                .filter((t) => EXCLUSIVE_ROLE_TAGS.has(t));
              const roleSpecificFiltered =
                requestedExclusive.length > 0
                  ? typeFiltered.filter((ev: any) => {
                      const evTags = (ev.tags ?? []).map((t: string) =>
                        t.toLowerCase()
                      );
                      return !evTags.some(
                        (t: string) =>
                          EXCLUSIVE_ROLE_TAGS.has(t) &&
                          !requestedExclusive.includes(t)
                      );
                    })
                  : typeFiltered;

              // Apply time filter first (before profile and limit)
              const timeFiltered = timeFilter
                ? applyTimeFilter(roleSpecificFiltered, timeFilter)
                : roleSpecificFiltered;

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

              console.log('[hackbot][stream][tool] get_events counts', {
                total: events.length, afterDate: dateFiltered.length,
                afterType: typeFiltered.length, afterRole: roleSpecificFiltered.length,
                afterTime: timeFiltered.length, afterProfile: profileFiltered.length,
                afterLimit: limited.length,
              });
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

    // Build a custom stream using the Data Stream Protocol format so the
    // existing widget parser (0: text, 8: annotations, a: tool results) works.
    //
    // We use a ReadableStream with an inline start() function that consumes
    // fullStream directly. This avoids TransformStream backpressure issues that
    // cause ResponseAborted when the HTTP layer and IIFE run out of sync.
    const enc = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        // ai@6 usage format: { inputTokens, outputTokens, inputTokenDetails.cacheReadTokens }
        let finishPromptTokens = 0;
        let finishCompletionTokens = 0;
        let finishCachedTokens = 0;
        let streamError: string | null = null;

        const enq = (line: string) =>
          controller.enqueue(enc.encode(line));

        // Suppress post-tool text only when the model has already output text
        // in a prior step. This prevents the model from "narrating" its own
        // tool results (e.g. summarising event cards that the UI already shows).
        //
        // IMPORTANT: if the model calls tools FIRST (no text in step 1) and
        // generates its full response in step 2, we must NOT suppress that text.
        // suppressText is therefore only armed after text has been emitted.
        let textHasBeenOutput = false;
        let suppressText = false;

        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          for await (const part of (result as any).fullStream) {
            if (part?.type === 'text-delta') {
              // ai@6: text-delta part has `text` field
              if (!suppressText) {
                enq(`0:${JSON.stringify(part.text ?? '')}\n`);
                if (part.text) textHasBeenOutput = true;
              }
            } else if (part?.type === 'tool-call') {
              console.log(`[hackbot][stream][tool] calling: ${part.toolName}`);
              // Notify client that a tool call is in flight (for loading indicator)
              enq(
                `9:${JSON.stringify([
                  {
                    toolCallId: part.toolCallId,
                    toolName: part.toolName,
                    state: 'call',
                  },
                ])}\n`
              );
            } else if (part?.type === 'tool-result') {
              // Only arm suppressText once the model has already shown text.
              // If no text yet, let step-2+ text through (tools-first pattern).
              if (textHasBeenOutput) suppressText = true;
              // ai@6: tool-result part has `output` field (not `result`)
              enq(
                `a:${JSON.stringify([
                  {
                    toolCallId: part.toolCallId,
                    toolName: part.toolName,
                    state: 'result',
                    result: part.output,
                  },
                ])}\n`
              );
            } else if (part?.type === 'error') {
              console.error('[hackbot][stream] OpenAI error in stream:', part.error);
              streamError = (part.error as any)?.message ?? 'OpenAI server error';
              break;
            } else if (part?.type === 'finish') {
              // ai@6: finish part uses `totalUsage`
              finishPromptTokens = part.totalUsage?.inputTokens ?? 0;
              finishCompletionTokens = part.totalUsage?.outputTokens ?? 0;
              finishCachedTokens =
                part.totalUsage?.inputTokenDetails?.cacheReadTokens ?? 0;
            } else if (part?.type === 'finish-step' && finishPromptTokens === 0) {
              // Fallback: finish-step uses `usage` (not `totalUsage`)
              finishPromptTokens = part.usage?.inputTokens ?? 0;
              finishCompletionTokens = part.usage?.outputTokens ?? 0;
              finishCachedTokens =
                part.usage?.inputTokenDetails?.cacheReadTokens ?? 0;
            }
          }

          // Emit error event to client before closing so the widget can retry
          if (streamError) {
            enq(`3:${JSON.stringify('Something went wrong. Please try again.')}\n`);
          }
          controller.close();
        } catch (e) {
          console.error('[hackbot][stream] fullStream error', e);
          controller.error(e);
          return;
        }

        // Log + persist usage metrics (fire-and-forget, never blocks response)
        console.log('[hackbot][stream] usage', {
          promptTokens: finishPromptTokens,
          completionTokens: finishCompletionTokens,
          cachedPromptTokens: finishCachedTokens,
        });
        if (finishPromptTokens > 0) {
          getDatabase()
            .then((db) =>
              db.collection('hackbot_usage').insertOne({
                timestamp: new Date(),
                model,
                promptTokens: finishPromptTokens,
                completionTokens: finishCompletionTokens,
                cachedPromptTokens: finishCachedTokens,
              })
            )
            .catch((err) =>
              console.error('[hackbot][stream] usage insert failed', err)
            );
        }
      },
    });

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
