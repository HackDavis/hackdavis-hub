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

// Hacker invite types

export type HackerAdmissionType =
  | 'accept'
  | 'waitlist_accept'
  | 'waitlist'
  | 'reject';

export const HACKER_ADMISSION_TYPES: HackerAdmissionType[] = [
  'accept',
  'waitlist_accept',
  'waitlist',
  'reject',
];

export const HACKER_ADMISSION_LABELS: Record<HackerAdmissionType, string> = {
  accept: 'Accept',
  waitlist_accept: 'Waitlist Accept',
  waitlist: 'Waitlist',
  reject: 'Reject',
};

/** Accept and waitlist_accept require Tito + Hub invite; the others email only. */
export function admissionNeedsTitoAndHub(type: HackerAdmissionType): boolean {
  return type === 'accept' || type === 'waitlist_accept';
}

export interface HackerInviteData extends InviteData {
  admissionType: HackerAdmissionType;
}

export interface HackerInviteResult extends InviteResult {
  admissionType?: HackerAdmissionType;
  titoUrl?: string;
  inviteUrl?: string;
}

export type BulkHackerInviteResponse = BulkInviteResponse<HackerInviteResult>;

export interface SingleHackerInviteResponse {
  ok: boolean;
  admissionType?: HackerAdmissionType;
  titoUrl?: string;
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
