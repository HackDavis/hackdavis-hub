'use server';

import { ReleaseInvitation } from '@typeDefs/tito';
import { TitoRequest } from './titoClient';

/**
 * Fetches all existing invitations for an RSVP list and returns a map of
 * normalized email → titoUrl. Used to short-circuit duplicate API lookups
 * during bulk sends.
 */
export default async function getAllRsvpInvitations(
  rsvpListSlug: string
): Promise<Map<string, string>> {
  if (!rsvpListSlug) return new Map();
  const map = new Map<string, string>();
  const pageSize = 1000;
  let page = 1;

  let hasMore = true;
  while (hasMore) {
    try {
      const data = await TitoRequest<{
        release_invitations: ReleaseInvitation[];
      }>(
        `/rsvp_lists/${rsvpListSlug}/release_invitations?page[size]=${pageSize}&page[number]=${page}`
      );
      const invitations = data.release_invitations ?? [];

      for (const inv of invitations) {
        if (inv.email) {
          const url = inv.unique_url ?? inv.url;
          if (url) map.set(inv.email.toLowerCase(), url);
        }
      }

      hasMore = invitations.length === pageSize;
      page++;
    } catch (e) {
      console.error('[Tito] getAllRsvpInvitations failed on page', page, e);
      hasMore = false;
    }
  }

  return map;
}
