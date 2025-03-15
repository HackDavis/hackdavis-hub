'use server';

import { cookies } from 'next/headers';

export async function processInvite(slug: string) {
  slug = decodeURIComponent(slug);
  const slugComponents = slug.split('&');

  if (slugComponents.length === 2) {
    const data = slugComponents[0];
    const sig = slugComponents[1];

    cookies().set('data', data);
    cookies().set('sig', sig);

    return true;
  }

  return false;
}
