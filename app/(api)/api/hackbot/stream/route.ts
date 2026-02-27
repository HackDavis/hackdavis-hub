import { streamText, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { retrieveContext } from '@datalib/hackbot/getHackbotContext';
import { getDatabase } from '@utils/mongodb/mongoClient.mjs';

const MAX_USER_MESSAGE_CHARS = 200;
const MAX_HISTORY_MESSAGES = 10;

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

function parseIsoToMs(value: unknown): number | null {
  if (typeof value !== 'string') return null;
  const ms = Date.parse(value);
  return Number.isFinite(ms) ? ms : null;
}

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

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

    const systemPrompt =
      'You are HackDavis Helper ("Hacky"), an AI assistant for the HackDavis hackathon. ' +
      'CRITICAL: Your response MUST be under 200 tokens (~150 words). Be extremely concise. ' +
      'CRITICAL: Only answer questions about HackDavis. Refuse unrelated topics politely. ' +
      'CRITICAL: Only use facts from the provided context or tool results. Never invent times, dates, or locations. ' +
      'You are friendly, helpful, and conversational. Use contractions ("you\'re", "it\'s") and avoid robotic phrasing. ' +
      'For simple greetings ("hi", "hello"), respond warmly: "Hi, I\'m Hacky! I can help with questions about HackDavis." Keep it brief (1 sentence). ' +
      'For event/schedule questions (times, locations, when something starts/ends): ' +
      '  - ALWAYS call the get_events tool to get the latest schedule. Do not guess or use cached knowledge. ' +
      'For questions about HackDavis rules, submission, judging, tracks, or general info: ' +
      '  - Use the knowledge context below. ' +
      'When answering: ' +
      '1. Answer directly in 2-3 sentences using only facts from context or tool results. ' +
      '2. For time/location questions: provide the full range if both start and end times exist. ' +
      '3. For schedule questions: format as a bullet list, ordered chronologically. ' +
      'Do NOT: ' +
      '- Invent times, dates, locations, or URLs. ' +
      '- Include URLs in your answer text (UI shows a separate "More info" link). ' +
      '- Answer coding, homework, or general knowledge questions. ' +
      '- Say "based on the context" or "according to the documents" (just answer directly). ' +
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
        content:
          'We have several workshops including:\n• Hackathons 101 (Sat 11:40 AM)\n• Getting Started with Git & GitHub (Sat 1:10 PM)\n• Intro to UI/UX (Sat 4:10 PM)\n• Hacking with LLMs (Sat 2:10 PM)',
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
    const maxTokens = parseInt(process.env.OPENAI_MAX_TOKENS || '200', 10);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = streamText({
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

              const formatted = events.map((ev: any) => ({
                name: String(ev.name || 'Event'),
                type: ev.type || null,
                start: formatEventDateTime(ev.start_time),
                end: formatEventDateTime(ev.end_time),
                location: ev.location || null,
                host: ev.host || null,
                tags: Array.isArray(ev.tags) ? ev.tags : [],
              }));

              // Sort chronologically
              formatted.sort((a: any, b: any) => {
                const aMs = a.start ? Date.parse(a.start) : null;
                const bMs = b.start ? Date.parse(b.start) : null;
                if (aMs === null && bMs === null) return 0;
                if (aMs === null) return 1;
                if (bMs === null) return -1;
                return aMs - bMs;
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
