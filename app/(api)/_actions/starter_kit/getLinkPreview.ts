'use server';

import { getLinkPreview } from 'link-preview-js';

export async function fetchLinkPreview(url: string) {
  try {
    const data = await getLinkPreview(url, {
      imagesPropertyType: 'og',
      headers: {
        'user-agent': 'googlebot',
        'Accept-Language': 'en-US',
      },
      timeout: 5000,
    });

    return {
      ok: true,
      data,
    };
  } catch (error) {
    console.error('Failed to fetch preview:', error);
    return {
      ok: false,
      error: 'Failed to fetch preview',
    };
  }
}
