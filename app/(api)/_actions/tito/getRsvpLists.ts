'use server';

import { RsvpList, TitoResponse } from '@typeDefs/tito';
import { TitoRequest } from './titoClient';

export default async function getRsvpLists(): Promise<TitoResponse<RsvpList[]>> {
  try {
    const start = Date.now();
    const data = await TitoRequest<{ rsvp_lists: RsvpList[] }>('/rsvp_lists');
    console.log(`[Tito] getRsvpLists: ${Date.now() - start}ms`);

    const rsvpLists = data.rsvp_lists ?? [];
    console.log(`[Tito] Fetched ${rsvpLists.length} RSVP lists`);
    return { ok: true, body: rsvpLists, error: null };
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error';
    console.error('[Tito] getRsvpLists failed:', error);
    return { ok: false, body: null, error };
  }
}
