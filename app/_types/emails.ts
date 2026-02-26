// Judge Hub invite types
export interface JudgeInviteData {
  firstName: string;
  lastName: string;
  email: string;
}

export interface JudgeInviteResult {
  email: string;
  success: boolean;
  inviteUrl?: string;
  error?: string;
}

export interface BulkJudgeInviteResponse {
  ok: boolean;
  results: JudgeInviteResult[];
  successCount: number;
  failureCount: number;
  error: string | null;
}

export interface SingleJudgeInviteResponse {
  ok: boolean;
  inviteUrl?: string;
  error: string | null;
}

// Mentor Hub invite types

export interface MentorInviteData {
  firstName: string;
  lastName: string;
  email: string;
}

export interface MentorInviteResult {
  email: string;
  success: boolean;
  titoUrl?: string;
  error?: string;
}

export interface BulkMentorInviteResponse {
  ok: boolean;
  results: MentorInviteResult[];
  successCount: number;
  failureCount: number;
  error: string | null;
}

export interface SingleMentorInviteResponse {
  ok: boolean;
  titoUrl?: string;
  error: string | null;
}
