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
