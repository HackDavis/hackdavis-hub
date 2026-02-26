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

export default async function getOrCreateTitoInvitation(
  data: ReleaseInvitationRequest
): Promise<{ ok: true; titoUrl: string } | { ok: false; error: string }> {
  const { email, rsvpListSlug } = data;

  let titoResponse = await createRsvpInvitation(data);

  // Duplicate recovery: reuse existing URL if possible, otherwise delete + recreate
  if (!titoResponse.ok && isDuplicateTicketError(titoResponse.error)) {
    console.warn(`[Tito] Duplicate detected for ${email}, attempting recovery`);

    const existingRes = await getRsvpInvitationByEmail(rsvpListSlug, email);
    if (existingRes.ok && existingRes.body) {
      const existingUrl = existingRes.body.unique_url ?? existingRes.body.url;
      if (existingUrl) {
        console.log(`[Tito] Reusing existing URL for ${email}`);
        return { ok: true, titoUrl: existingUrl };
      }
    }

    console.warn(`[Tito] No usable URL found, deleting and recreating for ${email}`);
    const deleteRes = await deleteRsvpInvitationByEmail(rsvpListSlug, email);
    if (!deleteRes.ok) {
      return { ok: false, error: `Duplicate recovery failed (delete): ${deleteRes.error}` };
    }
    titoResponse = await createRsvpInvitation(data);
  }

  if (!titoResponse.ok || !titoResponse.body) {
    return { ok: false, error: titoResponse.error ?? 'Failed to create Tito invitation' };
  }

  const titoUrl = titoResponse.body.unique_url ?? titoResponse.body.url;
  if (!titoUrl) {
    return { ok: false, error: 'Tito invitation created but no URL was returned' };
  }

  return { ok: true, titoUrl };
}
