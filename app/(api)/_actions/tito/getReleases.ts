'use server';

import { Release, TitoResponse } from '@typeDefs/tito';
import { TitoRequest } from './titoClient';

export default async function getReleases(): Promise<TitoResponse<Release[]>> {
  try {
    const data = await TitoRequest<{ releases: Release[] }>('/releases');

    const releases = data.releases ?? [];
    return { ok: true, body: releases, error: null };
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error';
    console.error('[Tito] getReleases failed:', error);
    return { ok: false, body: null, error };
  }
}
