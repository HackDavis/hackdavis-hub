export type HackDocType =
  | 'event'
  | 'track'
  | 'judging'
  | 'submission'
  | 'faq'
  | 'general';

export interface HackDoc {
  id: string;
  type: HackDocType;
  title: string;
  text: string;
  url?: string;
}

export type HackerProfile = {
  name?: string;
  position?: string;
  is_beginner?: boolean;
};

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
      inputTokens?: number;
      outputTokens?: number;
      totalTokens?: number;
    };
    embeddings?: {
      inputTokens?: number;
      totalTokens?: number;
    };
  };
}

export type HackbotEvent = {
  id: string;
  name: string;
  type: string | null;
  start: string | null;
  end: string | null;
  startMs: number | null;
  location: string | null;
  host: string | null;
  tags: string[];
  isRecommended?: boolean;
  /** True for GENERAL/MEALS — rendered as a compact inline row */
  compact?: boolean;
};

export type HackbotLink = { label: string; url: string };

export type HackbotChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  /** @deprecated use links[] instead; kept for localStorage backwards-compat */
  url?: string;
  links?: HackbotLink[];
  events?: HackbotEvent[];
};

export interface HackbotClientMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface HackbotValidatedRequest {
  currentPath?: string;
  sanitizedMessages: HackbotClientMessage[];
  lastMessage: HackbotClientMessage;
}

export interface HackbotSessionDocsResult {
  session: unknown;
  docs: HackDoc[];
}
