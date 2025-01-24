import { AuthError } from 'next-auth';

import { signIn } from '@/auth';

export default async function Login(email: string, password: string) {
  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    return { ok: true, body: 'Successfully logged in', error: null };
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
