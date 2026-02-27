// ── Shared Hackbot types ────────────────────────────────────────────────────
// Pure type file — no 'use server'/'use client' directive.
// Safe to import from server actions, API routes, client components, and utils.

// ── Knowledge doc types ─────────────────────────────────────────────────────

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

// ── Hacker profile ──────────────────────────────────────────────────────────

export type HackerProfile = {
  name?: string;
  position?: string;
  is_beginner?: boolean;
};

// ── Chat message types ──────────────────────────────────────────────────────

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

// ── Widget types ────────────────────────────────────────────────────────────

export type HackbotEvent = {
  id: string;
  name: string;
  type: string | null;
  start: string | null;
  end: string | null;
  location: string | null;
  host: string | null;
  tags: string[];
  isRecommended?: boolean;
};

export type HackbotChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  url?: string;
  events?: HackbotEvent[];
};
