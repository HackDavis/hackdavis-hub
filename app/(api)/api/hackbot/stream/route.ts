import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';
import { retrieveContext } from '@datalib/hackbot/getHackbotContext';
import { HackbotMessage } from '@actions/hackbot/askHackbot';

const MAX_USER_MESSAGE_CHARS = 200;
const MAX_HISTORY_MESSAGES = 10;

function parseIsoToMs(value: unknown): number | null {
  if (typeof value !== 'string') return null;
  const ms = Date.parse(value);
  return Number.isFinite(ms) ? ms : null;
}

function stripExternalDomains(text: string): string {
  return text.replace(/https?:\/\/[^\s)]+(\/[\w#/?=&.-]*)/g, '$1');
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

    // Retrieve context using adaptive retrieval
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

    if (!docs || docs.length === 0) {
      return Response.json(
        { error: 'No context found. Please contact an organizer.' },
        { status: 500 }
      );
    }

    // Sort docs chronologically (events first)
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
      ...messages.slice(-MAX_HISTORY_MESSAGES),
    ];

    // Stream response using Vercel AI SDK
    const mode = process.env.HACKBOT_MODE || 'google';
    let result;

    if (mode === 'google') {
      const model = process.env.GOOGLE_MODEL || 'gemini-1.5-flash';
      const maxTokens = parseInt(process.env.GOOGLE_MAX_TOKENS || '200', 10);

      result = streamText({
        model: google(model),
        messages: chatMessages.map((m: any) => ({
          role: m.role as 'system' | 'user' | 'assistant',
          content: m.content,
        })),
        maxTokens,
      });
    } else {
      // OpenAI fallback
      const model = process.env.OPENAI_MODEL || 'gpt-4o';
      const maxTokens = parseInt(process.env.OPENAI_MAX_TOKENS || '200', 10);

      result = streamText({
        model: openai(model),
        messages: chatMessages.map((m: any) => ({
          role: m.role as 'system' | 'user' | 'assistant',
          content: m.content,
        })),
        maxTokens,
      });
    }

    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error('[hackbot][stream] Error', error);

    // Differentiate error types
    if (error.status === 429) {
      return Response.json(
        { error: 'Too many requests. Please wait a moment and try again.' },
        { status: 429 }
      );
    }

    if (error.status === 401 || error.message?.includes('API key')) {
      return Response.json(
        { error: 'AI service configuration error. Please contact an organizer.' },
        { status: 500 }
      );
    }

    return Response.json(
      { error: 'Something went wrong. Please try again in a moment.' },
      { status: 500 }
    );
  }
}
