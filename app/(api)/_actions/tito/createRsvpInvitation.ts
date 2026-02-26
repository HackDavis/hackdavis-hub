'use server';

import { ReleaseInvitation, ReleaseInvitationRequest, TitoResponse } from '@typeDefs/tito';
import { TitoRequest } from './titoClient';

const MAX_RETRIES = 5;
const BASE_DELAY_MS = 1000;

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function createRsvpInvitation(
  data: ReleaseInvitationRequest
): Promise<TitoResponse<ReleaseInvitation>> {
  try {
    if (!data.email?.trim()) throw new Error('Email is required');
    if (!data.rsvpListSlug) throw new Error('RSVP list slug is required');
    if (!data.releaseIds?.trim()) throw new Error('Release IDs are required');

    const releaseIdsArray = data.releaseIds
      .split(',')
      .map((id) => parseInt(id.trim(), 10))
      .filter((id) => !isNaN(id));

    if (releaseIdsArray.length === 0) {
      throw new Error('Invalid release IDs format. Use comma-separated numbers.');
    }

    const requestBody: {
      email: string;
      release_ids: number[];
      first_name?: string;
      last_name?: string;
      discount_code?: string;
    } = { email: data.email.trim(), release_ids: releaseIdsArray };

    if (data.firstName?.trim()) requestBody.first_name = data.firstName.trim();
    if (data.lastName?.trim()) requestBody.last_name = data.lastName.trim();
    if (data.discountCode?.trim()) requestBody.discount_code = data.discountCode.trim();

    const url = `/rsvp_lists/${data.rsvpListSlug}/release_invitations`;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await TitoRequest<{ release_invitation: ReleaseInvitation }>(url, {
          method: 'POST',
          body: JSON.stringify({ release_invitation: requestBody }),
        });
        console.log(`[Tito] ✓ Created invitation for ${data.email}`);
        return { ok: true, body: response.release_invitation, error: null };
      } catch (err: any) {
        if (err.message.includes('429') && attempt < MAX_RETRIES) {
          const waitMs = err.retryAfter
            ? parseFloat(err.retryAfter) * BASE_DELAY_MS
            : Math.pow(2, attempt) * BASE_DELAY_MS + Math.random() * BASE_DELAY_MS;
          console.warn(
            `[Tito] 429 rate-limited for ${data.email}, retrying in ${Math.round(waitMs)}ms (attempt ${attempt + 1}/${MAX_RETRIES})`
          );
          await delay(waitMs);
          continue;
        }
        throw err;
      }
    }

    throw new Error('Tito API rate limit exceeded after 5 retries');
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error';
    console.error('[Tito] createRsvpInvitation failed:', error);
    return { ok: false, body: null, error };
  }
}
