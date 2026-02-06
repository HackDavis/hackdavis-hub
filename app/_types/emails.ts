export interface MentorData {
  firstName: string;
  lastName: string;
  email: string;
}

export interface BulkInviteOptions {
  mentors: MentorData[];
  rsvpListSlug: string;
  releaseIds: string;
}

export interface InviteResult {
  email: string;
  success: boolean;
  titoUrl?: string;
  error?: string;
}

export interface BulkInviteResponse {
  ok: boolean;
  results: InviteResult[];
  successCount: number;
  failureCount: number;
  error: string | null;
}

export interface SingleMentorOptions {
  firstName: string;
  lastName: string;
  email: string;
  rsvpListSlug: string;
  releaseIds: string;
}

export interface SingleInviteResponse {
  ok: boolean;
  titoUrl?: string;
  error: string | null;
}

export type EmailType =
  | '2026AcceptedTemplate'
  | '2026WaitlistedTemplate'
  | '2026WaitlistAcceptedTemplate'
  | '2026WaitlistRejectedTemplate';

export interface HackerEmailOptions {
  firstName: string;
  lastName: string;
  email: string;
  emailType: EmailType;
  rsvpListSlug?: string;
  releaseIds?: string;
}

export interface HackerEmailResponse {
  ok: boolean;
  titoUrl?: string;
  hubUrl?: string;
  error: string | null;
}
