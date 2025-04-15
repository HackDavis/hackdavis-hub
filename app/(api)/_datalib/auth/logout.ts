import { AuthError } from 'next-auth';

import { signOut } from '@/auth';

export default async function Logout() {
  try {
    await signOut({ redirect: false });

    return { ok: true, body: 'Successfully logged out', error: null };
  } catch (error) {
    if (error instanceof AuthError && error?.cause?.err?.message) {
      return {
        ok: false,
        body: null,
        error: error.cause.err.message,
      };
    }

    return {
      ok: false,
      body: null,
      error: 'Authentication error.',
    };
  }
}
