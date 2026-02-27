import { retrieveContext } from '@datalib/hackbot/getHackbotContext';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

export type HackbotMessageRole = 'user' | 'assistant' | 'system';

interface RetryOptions {
  maxAttempts: number;
  delayMs: number;
  backoffMultiplier: number;
  retryableErrors?: string[];
}

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  const {
    maxAttempts,
    delayMs,
    backoffMultiplier,
    retryableErrors = ['ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND'],
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;

      const isRetryable =
        retryableErrors.some((code) => err.message?.includes(code)) ||
        err.status === 429 ||
        err.status === 500 ||
        err.status === 502 ||
        err.status === 503 ||
        err.status === 504;

      if (!isRetryable || attempt === maxAttempts) {
        throw err;
      }

      const delay = delayMs * Math.pow(backoffMultiplier, attempt - 1);
      console.log(
        `[hackbot][retry] Attempt ${attempt}/${maxAttempts} failed. Retrying in ${delay}ms...`,
        err.message
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

export interface HackbotMessage {
  role: HackbotMessageRole;
  content: string;
}

export interface HackbotResponse {
  ok: boolean;
  answer: string;
  url?: string;
  error?: string;
  usage?: {
    chat?: {
      promptTokens?: number;
      completionTokens?: number;
      totalTokens?: number;
    };
    embeddings?: {
      promptTokens?: number;
      totalTokens?: number;
    };
  };
}

const MAX_USER_MESSAGE_CHARS = 200;
const MAX_HISTORY_MESSAGES = 10;
const MAX_ANSWER_WORDS = 180;

function parseIsoToMs(value: unknown): number | null {
  if (typeof value !== 'string') return null;
  const ms = Date.parse(value);
  return Number.isFinite(ms) ? ms : null;
}

function truncateToWords(text: string, maxWords: number): string {
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) return text.trim();
  return words.slice(0, maxWords).join(' ') + '...';
}

function stripExternalDomains(text: string): string {
  return text.replace(/https?:\/\/[^\s/)]+(\S*)/g, '$1');
}

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

  if (!docs || docs.length === 0) {
    return {
      ok: false,
      answer: '',
      error:
        'HackDavis Helper could not find any context documents in its vector index. Please contact an organizer.',
    };
  }

  const sortedDocs = (() => {
    const eventDocs = docs.filter((d: any) => d.type === 'event');
    const otherDocs = docs.filter((d: any) => d.type !== 'event');

    eventDocs.sort((a: any, b: any) => {
      const aMs = parseIsoToMs(a.startISO);
      const bMs = parseIsoToMs(b.startISO);

      if (aMs === null && bMs === null) return 0;
      if (aMs === null) return 1;
      if (bMs === null) return -1;
      return aMs - bMs;
    });

    return [...eventDocs, ...otherDocs];
  })();

  const primaryUrl =
    sortedDocs.find((d) => d.type === 'event' && d.url)?.url ??
    sortedDocs.find((d) => d.url)?.url;

  const contextSummary = sortedDocs
    .map((d, index) => {
      const header = `${index + 1}) [type=${d.type}, title="${d.title}"${
        d.url ? `, url="${d.url}"` : ''
      }]`;
      return `${header}\n${d.text}`;
    })
    .join('\n\n');

  const systemPrompt =
    'You are HackDavis Helper ("Hacky"), an AI assistant for the HackDavis hackathon. ' +
    'CRITICAL: Your response MUST be under 200 tokens (~150 words). Be extremely concise. ' +
    'CRITICAL: Only answer questions about HackDavis. Refuse unrelated topics politely. ' +
    'CRITICAL: Only use facts from the provided context. Never invent times, dates, or locations. ' +
    'You are friendly, helpful, and conversational. Use contractions ("you\'re", "it\'s") and avoid robotic phrasing. ' +
    'For simple greetings ("hi", "hello"), respond warmly: "Hi, I\'m Hacky! I can help with questions about HackDavis." Keep it brief (1 sentence). ' +
    'For questions about HackDavis: ' +
    '1. First, silently identify the most relevant context document by matching key terms to document titles. ' +
    '2. If multiple documents seem relevant (e.g., similar event names), ask ONE short clarifying question instead of guessing. ' +
    '3. Answer directly in 2-3 sentences using only context facts. ' +
    '4. For time/location questions: Use only explicit times and locations from context. If both start and end times exist, provide the full range ("3:00 PM to 4:00 PM"). ' +
    '5. For schedule/timeline questions: Format as a bullet list, ordered chronologically. Include only items from context. ' +
    'Do NOT: ' +
    '- Invent times, dates, locations, or URLs not in context. ' +
    '- Include URLs in your answer text (UI shows separate "More info" link). ' +
    '- Use generic hackathon knowledge; only use provided context. ' +
    '- Answer coding, homework, or general knowledge questions. ' +
    '- Say "based on the context" or "according to the documents" (just answer directly). ' +
    'If you cannot find an answer in context, say: "I don\'t have that information. Please ask an organizer or check the HackDavis website." ' +
    'For unrelated questions (not about HackDavis), say: "Sorry, I can only answer questions about HackDavis. Do you have any questions about the event?"';

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
      content: `Context documents about HackDavis (use these to answer):\n\n${contextSummary}`,
    },
    ...trimmedHistory.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  ];

  try {
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
    const maxTokens = parseInt(process.env.OPENAI_MAX_TOKENS || '200', 10);

    const startedAt = Date.now();
    const { text, usage } = await retryWithBackoff(
      () =>
        generateText({
          model: openai(model) as any,
          messages: chatMessages.map((m) => ({
            role: m.role as 'system' | 'user' | 'assistant',
            content: m.content,
          })),
          maxTokens,
        }),
      {
        maxAttempts: 2,
        delayMs: 2000,
        backoffMultiplier: 2,
      }
    );

    console.log('[hackbot][openai][chat]', {
      model,
      promptTokens: usage.promptTokens,
      completionTokens: usage.completionTokens,
      totalTokens: usage.totalTokens,
      ms: Date.now() - startedAt,
    });

    const answer = truncateToWords(
      stripExternalDomains(text),
      MAX_ANSWER_WORDS
    );

    return {
      ok: true,
      answer,
      url: primaryUrl,
      usage: {
        chat: {
          promptTokens: usage.promptTokens,
          completionTokens: usage.completionTokens,
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
