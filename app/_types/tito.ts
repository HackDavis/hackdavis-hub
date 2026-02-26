export interface RsvpList {
  id: string;
  slug: string;
  title: string;
  release_ids?: number[];
  question_ids?: number[];
  activity_ids?: number[];
}

export interface Release {
  id: string;
  slug: string;
  title: string;
  quantity?: number;
}

export interface ReleaseInvitation {
  id: string;
  slug: string;
  email: string;
  first_name: string;
  last_name: string;
  url?: string;
  unique_url?: string;
  created_at: string;
}

export interface ReleaseInvitationRequest {
  firstName: string;
  lastName: string;
  email: string;
  rsvpListSlug: string;
  releaseIds: string; // comma-separated release IDs
  discountCode?: string;
}

export interface TitoResponse<T> {
  ok: boolean;
  body: T | null;
  error: string | null;
}
