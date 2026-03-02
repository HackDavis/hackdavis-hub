'use server';

import { ReleaseInvitation } from '@typeDefs/tito';
import { TitoRequest } from './titoClient';

export default async function deleteRsvpInvitationByEmail(
  rsvpListSlug: string,
  email: string
): Promise<{ ok: boolean; error: string | null }> {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) throw new Error('Email is required');
    if (!rsvpListSlug?.trim()) throw new Error('RSVP list slug is required');

    const pageSize = 1000;
    let page = 1;
    let foundSlug: string | null = null;

    while (!foundSlug) {
      const url = `/rsvp_lists/${rsvpListSlug}/release_invitations?page[size]=${pageSize}&page[number]=${page}`;
      const data = await TitoRequest<{
        release_invitations: ReleaseInvitation[];
      }>(url);
      const invitations = data.release_invitations ?? [];

      const match = invitations.find(
        (inv) => inv.email?.toLowerCase() === normalizedEmail
      );
      if (match?.slug) {
        foundSlug = match.slug;
        break;
      }

      if (invitations.length < pageSize) break;
      page++;
    }

    if (!foundSlug) {
      return {
        ok: false,
        error: 'No existing invitation found for this email',
      };
    }

    await TitoRequest(
      `/rsvp_lists/${rsvpListSlug}/release_invitations/${foundSlug}`,
      {
        method: 'DELETE',
      }
    );

    console.log(`[Tito] Deleted invitation for ${email}`);
    return { ok: true, error: null };
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error';
    console.error('[Tito] deleteRsvpInvitationByEmail failed:', error);
    return { ok: false, error };
  }
}
