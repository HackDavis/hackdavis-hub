import { retrieveContext } from '@datalib/hackbot/getHackbotContext';

export type HackbotMessageRole = 'user' | 'assistant' | 'system';

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
  // Replace absolute URLs like https://hackdavis.io/path with just /path.
  return text.replace(/https?:\/\/[^\s)]+(\/[\w#/?=&.-]*)/g, '$1');
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
  let embeddingsUsage:
    | {
        promptTokens?: number;
        totalTokens?: number;
      }
    | undefined;
  try {
    // Use a single, general context size (vector-only) to avoid
    // question-specific limits or retrieval heuristics.
    ({ docs, usage: embeddingsUsage } = await retrieveContext(last.content, {
      limit: 25,
    }));
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

  // Present event context in chronological order so the model doesn't
  // “pick a few” out of order when asked for itinerary/timeline questions.
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
    'You are HackDavis Helper, an assistant for the HackDavis hackathon. ' +
    'You have a friendly personality and introduce yourself as "Hacky". ' +
    'You may respond warmly to simple greetings (like "hi" or "hello") by saying something like: "Hi, I am Hacky! I can help with questions about HackDavis." ' +
    'You should happily answer high-level questions like "What is HackDavis?" as long as they are clearly about the HackDavis hackathon. ' +
    'Only refuse questions that are clearly unrelated to HackDavis or hackathons (for example, general trivia, homework, or other topics with no mention of HackDavis). ' +
    'For clearly unrelated questions, respond in a brief, friendly way such as: "Sorry, I can only answer questions about HackDavis." and optionally add a short follow-up like: "Do you have any questions about HackDavis?" ' +
    'For all other questions that mention HackDavis or obviously refer to the event (including "What is HackDavis?"), provide a concise, helpful answer based on your general knowledge of the event and the provided context. ' +
    'Keep every answer under 100 words. Prefer short, direct answers. ' +
    'First, silently pick the single most relevant context document by matching the user’s key terms to the document title (especially for event questions). ' +
    'If multiple events look plausible (similar names), ask one short clarifying question instead of guessing. ' +
    'For time/location questions, strongly prefer documents with type=event. ' +
    'When listing multiple schedule items (timeline/schedule/agenda/itinerary), format your answer as a bullet list (one item per line) using only items found in the context. ' +
    'If the user asks for itinerary/timeline, order items chronologically by the start time in the context. Do not present a random subset if more relevant items are available in the context. ' +
    'When giving times or locations, you MUST only use times, dates, and locations that explicitly appear in the provided context text. Do NOT use generic knowledge about hackathons. ' +
    'If a question is asking "When is" or "What time is" a specific event, and the context contains both a "Starts" line and an "Ends" line for that event, answer with the full range (for example: "The Closing Ceremony is from 3:00 PM to 4:00 PM Pacific Time."). ' +
    'If only a start time is present, answer with the start time. If only an end time is present, answer with the end time. Do not answer with only the end time when both are available. ' +
    'In particular, never say that a hackathon "ends on the same day it starts" or that it ends at 11:59 PM unless that exact wording appears in the context. ' +
    'If you cannot find an explicit time or place for what the user asked, say: "I do not know the exact time from the current schedule." ' +
    'Do not include any URLs in your answer text. The UI will show a separate “More info” link when available. ' +
    'Never invent domains such as "hackdavis.com" or new anchors. ' +
    'Write like a helpful human: use contractions, avoid robotic phrases, and answer in 1–3 short sentences unless the user asks for steps. ' +
    'Never generate code or answer homework, programming, or general knowledge questions.';

  // Prepare messages for the chat model (Ollama, GPT-compatible schema)
  const chatMessages = [
    { role: 'system', content: systemPrompt },
    {
      role: 'system',
      content: `Context documents about HackDavis (use these to answer):\n\n${contextSummary}`,
    },
    ...trimmedHistory.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  ];

  const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';

  try {
    const startedAt = Date.now();
    const response = await fetch(`${ollamaUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3.2',
        messages: chatMessages,
        stream: false,
      }),
    });

    if (!response.ok) {
      return {
        ok: false,
        answer: '',
        error: 'Upstream model error. Please try again later.',
      };
    }

    const data = await response.json();
    const rawAnswer: string = data?.message?.content?.toString() ?? '';

    const promptTokens =
      typeof data?.prompt_eval_count === 'number'
        ? data.prompt_eval_count
        : undefined;
    const completionTokens =
      typeof data?.eval_count === 'number' ? data.eval_count : undefined;
    const totalTokens =
      typeof promptTokens === 'number' && typeof completionTokens === 'number'
        ? promptTokens + completionTokens
        : undefined;

    console.log('[hackbot][ollama][chat]', {
      model: data?.model ?? 'unknown',
      promptTokens,
      completionTokens,
      totalTokens,
      ms: Date.now() - startedAt,
    });

    const answer = truncateToWords(
      stripExternalDomains(rawAnswer),
      MAX_ANSWER_WORDS
    );

    return {
      ok: true,
      answer,
      url: primaryUrl,
      usage: {
        chat: {
          promptTokens,
          completionTokens,
          totalTokens,
        },
        embeddings: embeddingsUsage,
      },
    };
  } catch (e) {
    console.error('Hackbot error', e);
    return {
      ok: false,
      answer: '',
      error: 'Something went wrong. Please try again later.',
    };
  }
}
