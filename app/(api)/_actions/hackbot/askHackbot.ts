import { retrieveContext } from '@datalib/hackbot/getHackbotContext';
import { generateText, tool, stepCountIs } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import { retryWithBackoff } from '@utils/hackbot/retryWithBackoff';
import { formatEventDateTime } from '@utils/hackbot/eventFormatting';
import type {
  HackbotMessage,
  HackbotMessageRole,
  HackbotResponse,
} from '@typeDefs/hackbot';

export type { HackbotMessage, HackbotMessageRole, HackbotResponse };

const MAX_USER_MESSAGE_CHARS = 200;
const MAX_HISTORY_MESSAGES = 10;
const MAX_ANSWER_WORDS = 180;

function truncateToWords(text: string, maxWords: number): string {
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) return text.trim();
  return words.slice(0, maxWords).join(' ') + '...';
}

const getEventsTool = tool({
  description:
    'Fetch the live HackDavis event schedule from the database. Use this for ANY question about event times, locations, schedule, or what is happening when.',
  inputSchema: z.object({
    type: z
      .string()
      .nullable()
      .describe(
        'Optional event type filter (e.g. "workshop", "meal", "ceremony"). Pass null to include all types.'
      ),
  }),
  execute: async ({ type }) => {
    try {
      const db = await getDatabase();
      const query = type ? { type: { $regex: type, $options: 'i' } } : {};
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

      console.log(
        `[hackbot][askHackbot][tool] get_events returned ${formatted.length} events`
      );
      return { events: formatted };
    } catch (e) {
      console.error('[hackbot][askHackbot][tool] get_events error', e);
      return {
        events: [],
        message: 'Could not fetch events. Please check the schedule page.',
      };
    }
  },
});

export async function askHackbot(
  messages: HackbotMessage[]
): Promise<HackbotResponse> {
  if (!messages.length) {
    return { ok: false, answer: '', error: 'No messages provided.' };
  }

  const last = messages[messages.length - 1];

  if (last.role !== 'user') {
    return { ok: false, answer: '', error: 'Last message must be from user.' };
  }

  if (last.content.length > MAX_USER_MESSAGE_CHARS) {
    return {
      ok: false,
      answer: '',
      error: `Message too long. Please keep it under ${MAX_USER_MESSAGE_CHARS} characters.`,
    };
  }

  const trimmedHistory = messages.slice(-MAX_HISTORY_MESSAGES);

  let docs;
  try {
    ({ docs } = await retrieveContext(last.content));
  } catch (e) {
    console.error('Hackbot context retrieval error', e);
    return {
      ok: false,
      answer: '',
      error:
        'HackDavis Helper search backend is not configured (vector search unavailable). Please contact an organizer.',
    };
  }

  const contextSummary =
    docs && docs.length > 0
      ? docs
          .map((d, index) => {
            const header = `${index + 1}) [type=${d.type}, title="${d.title}"${
              d.url ? `, url="${d.url}"` : ''
            }]`;
            return `${header}\n${d.text}`;
          })
          .join('\n\n')
      : 'No additional knowledge context found.';

  const primaryUrl = docs?.find((d) => d.url)?.url;

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
    ...trimmedHistory.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  ];

  try {
    const model = process.env.OPENAI_MODEL || 'gpt-5-mini';
    const maxOutputTokens = parseInt(
      process.env.OPENAI_MAX_TOKENS || '600',
      10
    );

    const startedAt = Date.now();
    const { text, usage } = await retryWithBackoff(
      () =>
        generateText({
          model: openai(model) as any,
          messages: chatMessages.map((m) => ({
            role: m.role as 'system' | 'user' | 'assistant',
            content: m.content,
          })),
          maxOutputTokens,
          stopWhen: stepCountIs(5),
          tools: { get_events: getEventsTool },
          providerOptions: {
            openai: { reasoningEffort: 'low' },
          },
        }),
      {
        maxAttempts: 2,
        delayMs: 2000,
        backoffMultiplier: 2,
      }
    );

    console.log('[hackbot][openai][chat]', {
      model,
      inputTokens: usage.inputTokens,
      outputTokens: usage.outputTokens,
      totalTokens: usage.totalTokens,
      ms: Date.now() - startedAt,
    });

    const answer = truncateToWords(text, MAX_ANSWER_WORDS);

    return {
      ok: true,
      answer,
      url: primaryUrl,
      usage: {
        chat: {
          inputTokens: usage.inputTokens,
          outputTokens: usage.outputTokens,
          totalTokens: usage.totalTokens,
        },
      },
    };
  } catch (e: any) {
    console.error('[hackbot][openai] Error', e);

    if (e.status === 429) {
      return {
        ok: false,
        answer: '',
        error: 'Too many requests. Please wait a moment and try again.',
      };
    }

    if (
      e.message?.includes('ECONNREFUSED') ||
      e.message?.includes('ETIMEDOUT')
    ) {
      return {
        ok: false,
        answer: '',
        error:
          'Cannot reach AI service. Please check your connection or try again later.',
      };
    }

    if (e.status === 401 || e.message?.includes('API key')) {
      return {
        ok: false,
        answer: '',
        error: 'AI service configuration error. Please contact an organizer.',
      };
    }

    return {
      ok: false,
      answer: '',
      error: 'Something went wrong. Please try again in a moment.',
    };
  }
}
