import { streamText, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { retrieveContext } from '@datalib/hackbot/getHackbotContext';
import { getDatabase } from '@utils/mongodb/mongoClient.mjs';

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

function formatEventDateTime(raw: unknown): string | null {
  let date: Date | null = null;
  if (raw instanceof Date) {
    date = raw;
  } else if (typeof raw === 'string') {
    date = new Date(raw);
  } else if (raw && typeof raw === 'object' && '$date' in (raw as any)) {
    date = new Date((raw as any).$date);
  }
  if (!date || Number.isNaN(date.getTime())) return null;
  return date.toLocaleString('en-US', {
    timeZone: 'America/Los_Angeles',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export async function POST(request: Request) {
  try {
    const { messages, currentPath, hackerProfile } = await request.json();

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
    const profile: HackerProfile | null = hackerProfile ?? null;
    const profileContext = profile
      ? `You are talking to ${profile.name ?? 'a hacker'}` +
        (profile.position
          ? `, a ${profile.is_beginner ? 'beginner ' : ''}${profile.position}`
          : profile.is_beginner
          ? ', a beginner'
          : '') +
        '. When they ask about events or workshops, call get_events and highlight ones where isRecommended=true as personalized picks. '
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
      '  - ALWAYS call the get_events tool to get the latest schedule. Do not guess or use cached knowledge. ' +
      '  - CRITICAL: After calling get_events, write ONE brief sentence only (e.g. "Here are the workshops:" or "I found X workshops for you!"). ' +
      '  - Do NOT list event names, times, or locations in your text — the UI displays interactive event cards automatically. ' +
      'For questions about HackDavis rules, submission, judging, tracks, or general info: ' +
      '  - Use the knowledge context below. Answer directly in 2-3 sentences. ' +
      'Do NOT: ' +
      '- Invent times, dates, locations, or URLs. ' +
      '- Include URLs in your answer text (UI shows a separate "More info" link). ' +
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
                'Optional event type filter (e.g. "workshop", "meal", "ceremony")'
              ),
          }),
          execute: async ({ type }) => {
            try {
              const db = await getDatabase();
              const query = type
                ? { type: { $regex: type, $options: 'i' } }
                : {};
              const events = await db
                .collection('events')
                .find(query)
                .sort({ start_time: 1 })
                .toArray();

              if (!events.length) {
                return { events: [], message: 'No events found.' };
              }

              // MongoDB already sorts by start_time ASC
              const formatted = events.map((ev: any) => ({
                id: String(ev._id),
                name: String(ev.name || 'Event'),
                type: ev.type || null,
                start: formatEventDateTime(ev.start_time),
                end: formatEventDateTime(ev.end_time),
                location: ev.location || null,
                host: ev.host || null,
                tags: Array.isArray(ev.tags) ? ev.tags : [],
                isRecommended: isEventRecommended(ev, profile),
              }));

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
