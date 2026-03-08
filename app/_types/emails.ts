// Judge Hub invite types
export interface InviteData {
  firstName: string;
  lastName: string;
  email: string;
}

export interface InviteResult {
  email: string;
  success: boolean;
  error?: string;
}

export interface BulkInviteResponse<R extends InviteResult = InviteResult> {
  ok: boolean;
  results: R[];
  successCount: number;
  failureCount: number;
  error: string | null;
}

// ── Judge types ─────────────────────────────────────────────────────────────

export type JudgeInviteData = InviteData;

export interface JudgeInviteResult extends InviteResult {
  inviteUrl?: string;
}

export type BulkJudgeInviteResponse = BulkInviteResponse<JudgeInviteResult>;

export interface SingleJudgeInviteResponse {
  ok: boolean;
  inviteUrl?: string;
  error: string | null;
}

// Mentor Hub invite types

export type MentorInviteData = InviteData;

export interface MentorInviteResult extends InviteResult {
  titoUrl?: string;
}

export type BulkMentorInviteResponse = BulkInviteResponse<MentorInviteResult>;

export interface SingleMentorInviteResponse {
  ok: boolean;
  titoUrl?: string;
  error: string | null;
}
