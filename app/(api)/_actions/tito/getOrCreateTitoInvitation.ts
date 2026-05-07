'use server';

import createRsvpInvitation from './createRsvpInvitation';
import getRsvpInvitationByEmail from './getRsvpInvitationByEmail';
import deleteRsvpInvitationByEmail from './deleteRsvpInvitationByEmail';
import { ReleaseInvitationRequest } from '@typeDefs/tito';

function isDuplicateTicketError(error: string | null | undefined): boolean {
  if (!error) return false;
  const normalized = error.toLowerCase();
  return (
    normalized.includes('already has a tito ticket attached') ||
    normalized.includes('already has a ticket attached') ||
    normalized.includes('email has already been taken') ||
    normalized.includes('has already been taken') ||
    (normalized.includes('"email"') && normalized.includes('already taken')) ||
    normalized.includes('already exists') ||
    (normalized.includes('already') && normalized.includes('invitation'))
  );
}

/**
 * Wrapper function to create a Tito invitation with duplicate handling.
 *
 * When a pre-fetched existingInvitationsMap is provided (email→url):
 *   - If the email is already in the map, return the cached URL immediately
 *     without hitting the Tito API at all.
 *   - Otherwise, create normally.
 *
 * When no map is provided (single invites):
 *   - Attempt to create; on duplicate error, fall back to a live
 *     getRsvpInvitationByEmail lookup, then delete+recreate if no URL found.
 *
 * For non-duplicate failures, the error is returned as-is (caller may retry).
 */
export default async function getOrCreateTitoInvitation(
  data: ReleaseInvitationRequest,
  existingInvitationsMap?: Map<string, string>
): Promise<{ ok: true; titoUrl: string } | { ok: false; error: string }> {
  const { email, rsvpListSlug } = data;

  // Skip the create call entirely if we already know this email has a ticket
  if (existingInvitationsMap) {
    const cached = existingInvitationsMap.get(email.toLowerCase());
    if (cached) {
      return { ok: true, titoUrl: cached };
    }
  }

  let titoResponse = await createRsvpInvitation(data);

  // Duplicate recovery for single-invite path (no pre-fetched map)
  if (!titoResponse.ok && isDuplicateTicketError(titoResponse.error)) {
    console.warn(`[Tito] Duplicate detected for ${email}, attempting recovery`);

    const existingRes = await getRsvpInvitationByEmail(rsvpListSlug, email);
    if (existingRes.ok && existingRes.body) {
      const existingUrl = existingRes.body.unique_url ?? existingRes.body.url;
      if (existingUrl) {
        return { ok: true, titoUrl: existingUrl };
      }
    }

    console.warn(
      `[Tito] No usable URL found, deleting and recreating for ${email}`
    );
    const deleteRes = await deleteRsvpInvitationByEmail(rsvpListSlug, email);
    if (!deleteRes.ok) {
      return {
        ok: false,
        error: `Tito duplicate recovery failed (delete): ${deleteRes.error}`,
      };
    }
    titoResponse = await createRsvpInvitation(data);
  }

  if (!titoResponse.ok || !titoResponse.body) {
    return {
      ok: false,
      error: titoResponse.error ?? 'Failed to create Tito invitation',
    };
  }

  const titoUrl = titoResponse.body.unique_url ?? titoResponse.body.url;
  if (!titoUrl) {
    return {
      ok: false,
      error: 'Tito invitation created but no URL was returned',
    };
  }

  return { ok: true, titoUrl };
}
