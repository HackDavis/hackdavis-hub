import type {
  HackbotClientMessage,
  HackbotValidatedRequest,
} from '@typeDefs/hackbot';

const MAX_USER_MESSAGE_CHARS = 200;
const MAX_HISTORY_MESSAGES = 30;
const MAX_MESSAGE_CHARS = 2000;
export const MAX_CONTEXT_HISTORY_MESSAGES = 6;
const MAX_TOTAL_MESSAGE_CHARS =
  MAX_CONTEXT_HISTORY_MESSAGES * MAX_MESSAGE_CHARS;
const ALLOWED_MESSAGE_ROLES = new Set(['user', 'assistant']);

export function validateRequestBody(
  payload: any
): HackbotValidatedRequest | Response {
  const { messages, currentPath } = payload ?? {};

  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }

  if (messages.length > MAX_HISTORY_MESSAGES) {
    return Response.json(
      {
        error: `Too many messages. Please keep history under ${MAX_HISTORY_MESSAGES} messages.`,
      },
      { status: 400 }
    );
  }

  const sanitizedMessages: HackbotClientMessage[] = [];
  let totalChars = 0;
  for (const message of messages) {
    const role = message?.role;
    const content = message?.content;
    if (!ALLOWED_MESSAGE_ROLES.has(role) || typeof content !== 'string') {
      return Response.json(
        { error: 'Invalid message history format.' },
        { status: 400 }
      );
    }

    const trimmedContent = content.trim();
    if (!trimmedContent) {
      // Tool-only replies can persist as empty assistant text in localStorage.
      // Drop them from request history instead of failing the whole request.
      if (role === 'assistant') continue;

      return Response.json(
        { error: 'Invalid message history format.' },
        { status: 400 }
      );
    }

    if (content.length > MAX_MESSAGE_CHARS) {
      return Response.json(
        {
          error: `Message too long. Keep each message under ${MAX_MESSAGE_CHARS} characters.`,
        },
        { status: 400 }
      );
    }

    totalChars += content.length;
    if (totalChars > MAX_TOTAL_MESSAGE_CHARS) {
      return Response.json(
        {
          error: `Message history too large. Keep total content under ${MAX_TOTAL_MESSAGE_CHARS} characters.`,
        },
        { status: 400 }
      );
    }

    sanitizedMessages.push({
      role: role as 'user' | 'assistant',
      content,
    });
  }

  if (sanitizedMessages.length === 0) {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }

  const lastMessage = sanitizedMessages[sanitizedMessages.length - 1];

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

  return { sanitizedMessages, lastMessage, currentPath };
}

export function isSimpleGreetingMessage(content: string): boolean {
  const normalized = content
    .trim()
    .replace(/[.!?]+$/, '')
    .trim();
  return /^(hi|hello|hey|thanks|thank you|ok|okay)$/i.test(normalized);
}
