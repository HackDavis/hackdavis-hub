import { streamText, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { retrieveContext } from '@datalib/hackbot/getHackbotContext';
import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import { auth } from '@/auth';
import {
  parseRawDate,
  formatEventDateTime,
  formatEventTime,
  isSameCalendarDay,
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
];

export async function POST(request: Request) {
  try {
    const { messages, currentPath } = await request.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: 'Invalid request' }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1];

    // Read profile directly from the JWT cookie — no client-side passing needed
    const session = await auth();
    const sessionUser = session?.user as any;
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

    // Retrieve knowledge context (non-event docs via vector search)
    let docs;
    try {
      ({ docs } = await retrieveContext(lastMessage.content));
    } catch (e) {
      console.error('[hackbot][stream] Context retrieval error', e);
      return Response.json(
        { error: 'Search backend unavailable. Please contact an organizer.' },
        { status: 500 }
      );
    }

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
    const maxTokens = parseInt(process.env.OPENAI_MAX_TOKENS || '600', 10);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = await streamText({
      model: openai(model) as any,
      messages: chatMessages.map((m: any) => ({
        role: m.role as 'system' | 'user' | 'assistant',
        content: m.content,
      })),
      maxTokens,
      maxSteps: 5,
      tools: {
        get_events: tool({
          description:
            'Fetch the live HackDavis event schedule from the database. Use this for ANY question about event times, locations, schedule, or what is happening when.',
          parameters: z.object({
            type: z
              .string()
              .optional()
              .describe(
                'Filter by event type: WORKSHOPS, MEALS, ACTIVITIES, or GENERAL'
              ),
            search: z
              .string()
              .optional()
              .describe(
                'Case-insensitive text search on event name (e.g. "dinner", "opening ceremony", "team")'
              ),
            limit: z
              .number()
              .optional()
              .describe(
                'Max number of events to return — use when only 1-3 results are expected'
              ),
            forProfile: z
              .boolean()
              .optional()
              .describe(
                "When true, filters results to only events relevant to the hacker's role/experience (beginner, developer, designer, pm). Events with no role tags are always included. Use this for personalised recommendations."
              ),
            timeFilter: z
              .enum(['today', 'now', 'upcoming', 'past'])
              .optional()
              .describe(
                'Filter events by time: "today" = starts today, "now" = currently live, "upcoming" = starts within 3 hours, "past" = already ended. Use for time-aware queries like "what\'s happening right now?" or "what workshops are today?"'
              ),
          }),
          execute: async ({ type, search, limit, forProfile, timeFilter }) => {
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

              // Apply time filter first (before profile and limit)
              const timeFiltered = timeFilter
                ? applyTimeFilter(events, timeFilter)
                : events;

              const filtered =
                forProfile && profile
                  ? timeFiltered.filter((ev: any) =>
                      isEventRelevantToProfile(ev, profile)
                    )
                  : timeFiltered;

              // Apply limit after all filters
              const limited = limit ? filtered.slice(0, limit) : filtered;

              if (!limited.length) {
                return { events: [], message: 'No events found.' };
              }

              const formatted = limited.map((ev: any) => {
                const startDate = parseRawDate(ev.start_time);
                const endDate = parseRawDate(ev.end_time);
                const endFormatted =
                  endDate && startDate && isSameCalendarDay(startDate, endDate)
                    ? formatEventTime(endDate)
                    : formatEventDateTime(ev.end_time);
                return {
                  id: String(ev._id),
                  name: String(ev.name || 'Event'),
                  type: ev.type || null,
                  start: startDate ? formatEventDateTime(ev.start_time) : null,
                  end: endFormatted,
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
      },
    });

    return result.toDataStreamResponse();
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
