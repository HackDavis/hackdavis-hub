'use server';

import { ReleaseInvitation, TitoResponse } from '@typeDefs/tito';
import { TitoRequest } from './titoClient';

export default async function getRsvpInvitationByEmail(
  rsvpListSlug: string,
  email: string
): Promise<TitoResponse<ReleaseInvitation>> {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) throw new Error('Email is required');
    if (!rsvpListSlug?.trim()) throw new Error('RSVP list slug is required');

    const pageSize = 1000;
    let page = 1;

    while (true) {
      const url = `/rsvp_lists/${rsvpListSlug}/release_invitations?page[size]=${pageSize}&page[number]=${page}`;
      const data = await TitoRequest<{ release_invitations: ReleaseInvitation[] }>(url);
      const invitations = data.release_invitations ?? [];

      const match = invitations.find(
        (inv) => inv.email?.toLowerCase() === normalizedEmail
      );
      if (match) return { ok: true, body: match, error: null };

      if (invitations.length < pageSize) break;
      page++;
    }

    return { ok: false, body: null, error: 'No existing invitation found for this email' };
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error';
    console.error('[Tito] getRsvpInvitationByEmail failed:', error);
    return { ok: false, body: null, error };
  }
}
