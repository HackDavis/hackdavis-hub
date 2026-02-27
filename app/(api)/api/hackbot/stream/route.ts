import { streamText, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { retrieveContext } from '@datalib/hackbot/getHackbotContext';
import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import { auth } from '@/auth';

const MAX_USER_MESSAGE_CHARS = 200;
const MAX_HISTORY_MESSAGES = 10;

const PATH_CONTEXT_MAP: Record<string, string> = {
  '/': 'the Hub homepage (announcements, prize tracks, mentor/director help, Discord)',
  '/#prize-tracks': 'the Prize Tracks section of the Hub homepage',
  '/#discord': 'the Discord / Stay Up To Date section of the Hub homepage',
  '/#mentor-help': 'the Mentor & Director Help section of the Hub homepage',
  '/project-info':
    'the Project Info page (submission process and judging process)',
  '/project-info#submission':
    'the Submission Process tab of the Project Info page',
  '/project-info#judging': 'the Judging Process tab of the Project Info page',
  '/starter-kit': 'the Starter Kit page',
  '/starter-kit#lets-begin':
    'the "Let\'s Begin" section of the Starter Kit (Hacking 101 intro)',
  '/starter-kit#find-a-team': 'the "Find a Team" section of the Starter Kit',
  '/starter-kit#ideate':
    'the "Ideate" section of the Starter Kit (brainstorming, previous hacks)',
  '/starter-kit#resources':
    'the "Resources" section of the Starter Kit (developer/designer/mentor resources)',
  '/schedule': 'the Schedule page',
};

function getPageContext(currentPath: string | undefined): string | null {
  if (!currentPath) return null;
  return PATH_CONTEXT_MAP[currentPath] ?? null;
}

type HackerProfile = {
  name?: string;
  position?: string;
  is_beginner?: boolean;
};

function isEventRecommended(ev: any, profile: HackerProfile | null): boolean {
  if (!profile) return false;
  if (!ev.tags || !Array.isArray(ev.tags)) return false;
  const tags = ev.tags.map((t: string) => t.toLowerCase());
  if (profile.position && tags.includes(profile.position.toLowerCase()))
    return true;
  if (profile.is_beginner && tags.includes('beginner')) return true;
  return false;
}

/**
 * Returns true if the event is relevant to the hacker's profile.
 * Events with no role/experience tags are considered relevant to everyone.
 * Events with specific tags are only relevant if the profile matches at least one.
 */
const ROLE_TAGS = new Set(['developer', 'designer', 'pm', 'beginner', 'other']);

function isEventRelevantToProfile(
  ev: any,
  profile: HackerProfile | null
): boolean {
  const tags: string[] = Array.isArray(ev.tags)
    ? ev.tags.map((t: string) => t.toLowerCase())
    : [];
  const roleTags = tags.filter((t) => ROLE_TAGS.has(t));
  // No role tags → relevant to everyone
  if (roleTags.length === 0) return true;
  // Has role tags → only relevant if profile matches
  if (!profile) return false;
  if (profile.position && roleTags.includes(profile.position.toLowerCase()))
    return true;
  if (profile.is_beginner && roleTags.includes('beginner')) return true;
  return false;
}

function parseRawDate(raw: unknown): Date | null {
  let date: Date | null = null;
  if (raw instanceof Date) {
    date = raw;
  } else if (typeof raw === 'string') {
    date = new Date(raw);
  } else if (raw && typeof raw === 'object' && '$date' in (raw as any)) {
    date = new Date((raw as any).$date);
  }
  return date && !Number.isNaN(date.getTime()) ? date : null;
}

function formatEventDateTime(raw: unknown): string | null {
  const date = parseRawDate(raw);
  if (!date) return null;
  return date.toLocaleString('en-US', {
    timeZone: 'America/Los_Angeles',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/** Returns only the time portion (e.g. "3:00 PM") — used when end is same day as start. */
function formatEventTime(date: Date): string {
  return date.toLocaleString('en-US', {
    timeZone: 'America/Los_Angeles',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function isSameCalendarDay(a: Date, b: Date): boolean {
  const opts: Intl.DateTimeFormatOptions = { timeZone: 'America/Los_Angeles' };
  return (
    a.toLocaleDateString('en-US', opts) === b.toLocaleDateString('en-US', opts)
  );
}

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
      `[hackbot][stream] message="${lastMessage.content?.slice(
        0,
        80
      )}" name=${profile?.name ?? 'n/a'} position=${profile?.position ?? 'n/a'} beginner=${
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
    const profileContext = profile
      ? `You are talking to ${profile.name ?? 'a hacker'}` +
        (profile.position
          ? `, a ${profile.is_beginner ? 'beginner ' : ''}${profile.position}`
          : profile.is_beginner
          ? ', a beginner'
          : '') +
        '. When they ask about events or workshops, call get_events and highlight ones where isRecommended=true as personalized picks. ' +
        'If they ask what you know about them, you may share: their name' +
        (profile.position ? `, their role (${profile.position})` : '') +
        (profile.is_beginner !== undefined
          ? `, and that they are${profile.is_beginner ? '' : ' not'} a beginner`
          : '') +
        '. Use their name naturally when it fits the conversation — not in every sentence. '
      : '';
    const systemPrompt =
      'You are HackDavis Helper ("Hacky"), an AI assistant for the HackDavis hackathon. ' +
      profileContext +
      (pageContext
        ? `The user is currently viewing: ${pageContext}. Use this to give more relevant answers. `
        : '') +
      'CRITICAL: Only answer questions about HackDavis. Refuse unrelated topics politely. ' +
      'CRITICAL: Only use facts from the provided context or tool results. Never invent times, dates, or locations. ' +
      'You are friendly, helpful, and conversational. Use contractions ("you\'re", "it\'s") and avoid robotic phrasing. ' +
      'For simple greetings ("hi", "hello"), respond warmly: "Hi, I\'m Hacky! I can help with questions about HackDavis." Keep it brief (1 sentence). ' +
      'For event/schedule questions (times, locations, when something starts/ends): ' +
      '  - ALWAYS call get_events with the most specific filters available. ' +
      '  - When the user asks about a named event or keyword (e.g. "dinner", "opening ceremony", "team finding meetup"), pass that keyword as the "search" parameter to narrow results. ' +
      '  - When the user asks about a category (e.g. "workshops", "meals"), pass the type filter (WORKSHOPS, MEALS, ACTIVITIES, GENERAL). ' +
      '  - Use "limit" to cap results when only one or a few events are expected (e.g. "when is dinner?" → limit:3). ' +
      '  - CRITICAL: After calling get_events, write ONE brief sentence only (e.g. "Here are the workshops:" or "Found it!"). ' +
      '  - Do NOT list event names, times, or locations in your text — the UI displays interactive event cards automatically. ' +
      'For event recommendations ("what should I attend?", "what\'s fun?", "suggest events", etc.): ' +
      '  - Call get_events twice: once with {type:WORKSHOPS, forProfile:true} and once with {type:ACTIVITIES, forProfile:true}. ' +
      "  - forProfile:true filters results to events tagged for the hacker's role/experience level. If no profile is available, it returns everything. " +
      '  - Do NOT include MEALS or GENERAL — those are self-explanatory and not worth recommending. ' +
      '  - Respond with a single brief sentence like "Here are some events picked for you!" and let the cards speak for themselves. ' +
      'For social or team-related questions (e.g. "how do I meet teammates?", "networking"): ' +
      '  - Check the knowledge context first AND call get_events with a relevant search term to surface any team-building events. ' +
      '  - Summarise advice from the knowledge context in 1-2 sentences, then say "I also found some relevant events:" if get_events returned results. ' +
      'For questions about HackDavis rules, submission, judging, tracks, or general info: ' +
      '  - Use the knowledge context below. Answer directly in 2-3 sentences. ' +
      'Do NOT: ' +
      '- Invent times, dates, locations, or URLs. ' +
      '- Include URLs in your answer text. ' +
      '- Answer coding, homework, or general knowledge questions. ' +
      '- Say "based on the context" or "according to the documents" (just answer directly). ' +
      '- List event details in text when get_events has been called (cards show everything). ' +
      'Always complete your response — never end mid-sentence. ' +
      'If you cannot find an answer, say: "I don\'t have that information. Please ask an organizer or check the HackDavis website." ' +
      'For unrelated questions, say: "Sorry, I can only answer questions about HackDavis. Do you have any questions about the event?"';

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
        content: 'What workshops are available?',
      },
      {
        role: 'assistant' as const,
        content: 'Here are all the workshops at HackDavis — check them out!',
      },
    ];

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
    const maxTokens = parseInt(process.env.OPENAI_MAX_TOKENS || '400', 10);

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
          }),
          execute: async ({ type, search, limit, forProfile }) => {
            try {
              const db = await getDatabase();
              const query: Record<string, unknown> = {};
              if (type) query.type = { $regex: type, $options: 'i' };
              if (search) query.name = { $regex: search, $options: 'i' };

              let cursor = db
                .collection('events')
                .find(query)
                .sort({ start_time: 1 });
              if (limit) cursor = cursor.limit(limit);
              const events = await cursor.toArray();

              const filtered =
                forProfile && profile
                  ? events.filter((ev: any) =>
                      isEventRelevantToProfile(ev, profile)
                    )
                  : events;

              if (!filtered.length) {
                return { events: [], message: 'No events found.' };
              }

              const formatted = filtered.map((ev: any) => {
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
