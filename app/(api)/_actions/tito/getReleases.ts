'use server';
import { Release, TitoResponse } from '@typeDefs/tito';

const TITO_API_TOKEN = process.env.TITO_API_TOKEN;
const TITO_ACCOUNT_SLUG = process.env.TITO_ACCOUNT_SLUG;
const TITO_EVENT_SLUG = process.env.TITO_EVENT_SLUG;

export default async function getReleases(): Promise<TitoResponse<Release[]>> {
  try {
    if (!TITO_API_TOKEN || !TITO_ACCOUNT_SLUG || !TITO_EVENT_SLUG) {
      const error = 'Missing Tito API configuration in environment variables';
      console.error('[Tito API] getReleases:', error);
      throw new Error(error);
    }

    const url = `https://api.tito.io/v3/${TITO_ACCOUNT_SLUG}/${TITO_EVENT_SLUG}/releases`;

    const fetchStartTime = Date.now();
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Token token=${TITO_API_TOKEN}`,
        Accept: 'application/json',
      },
    });
    const fetchEndTime = Date.now();
    console.log(
      `[Tito API] HTTP GET releases request took ${
        fetchEndTime - fetchStartTime
      }ms`
    );

    if (!response.ok) {
      const errorText = await response.text();
      const errorMsg = `Tito API error: ${response.status} - ${errorText}`;
      console.error('[Tito API] getReleases failed:', errorMsg);
      console.error('[Tito API] Request URL:', url);
      throw new Error(errorMsg);
    }

    const data = await response.json();
    const releases = data.releases || [];

    console.log('[Tito API] Successfully fetched', releases.length, 'releases');

    return {
      ok: true,
      body: releases,
      error: null,
    };
  } catch (e) {
    const error = e as Error;
    console.error('[Tito API] getReleases exception:', error);
    return {
      ok: false,
      body: null,
      error: error.message,
    };
  }
}
