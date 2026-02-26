'use server';

import { Release, TitoResponse } from '@typeDefs/tito';
import { TitoRequest } from './titoClient';

export default async function getReleases(): Promise<TitoResponse<Release[]>> {
  try {
    const start = Date.now();
    const data = await TitoRequest<{ releases: Release[] }>('/releases');
    console.log(`[Tito] getReleases: ${Date.now() - start}ms`);

    const releases = data.releases ?? [];
    console.log(`[Tito] Fetched ${releases.length} releases`);
    return { ok: true, body: releases, error: null };
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error';
    console.error('[Tito] getReleases failed:', error);
    return { ok: false, body: null, error };
  }
}
