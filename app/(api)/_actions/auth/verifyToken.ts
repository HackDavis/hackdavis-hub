'use server';

import { VerifyAuthToken } from '@datalib/auth/authToken';
import { cookies } from 'next/headers';

export default async function VerifyToken() {
  const cookieStore = cookies();
  const cookie = cookieStore.get('auth_token');
  if (!cookie) {
    return { ok: false, body: null, error: 'No Auth Token Found' };
  }
  const token = cookie.value;

  return VerifyAuthToken(token);
}
