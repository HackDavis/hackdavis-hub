'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export default async function LoginAction(
  email?: FormDataEntryValue | null,
  password?: FormDataEntryValue | null
): Promise<{
  ok: boolean;
  body?: null;
  error?: string | null;
}> {
  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    return { ok: true, body: null, error: null };
  } catch (error) {
    if (
      error instanceof AuthError &&
      error.cause &&
      error.cause.err &&
      error.cause.err.message
    ) {
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
