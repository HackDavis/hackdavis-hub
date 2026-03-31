import type {
  HackbotClientMessage,
  HackbotValidatedRequest,
} from '@typeDefs/hackbot';

const MAX_USER_MESSAGE_CHARS = 200;
const ALLOWED_MESSAGE_ROLES = new Set(['user', 'assistant']);

export function validateRequestBody(
  payload: any
): HackbotValidatedRequest | Response {
  const { messages, currentPath } = payload ?? {};

  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }

  const sanitizedMessages: HackbotClientMessage[] = [];
  for (const message of messages) {
    const role = message?.role;
    const content = message?.content;
    if (
      !ALLOWED_MESSAGE_ROLES.has(role) ||
      typeof content !== 'string' ||
      !content.trim()
    ) {
      return Response.json(
        { error: 'Invalid message history format.' },
        { status: 400 }
      );
    }
    sanitizedMessages.push({
      role: role as 'user' | 'assistant',
      content,
    });
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
  return /^(hi|hello|hey|thanks|thank you|ok|okay)\b/i.test(content.trim());
}
