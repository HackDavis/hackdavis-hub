'use server';

import { signIn } from '@/auth';

export default async function LoginAction(
  email?: FormDataEntryValue | null,
  password?: FormDataEntryValue | null
): Promise<{
  ok: boolean;
  body?: null;
  error?: string | null;
}> {
  try {
    const response = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (!response.ok) {
      throw new Error(response.error);
    }

    return { ok: true, body: null, error: null };
  } catch (e) {
    const error = e as Error;
    const cause = error.cause as any;
    if (cause.err.message) {
      return {
        ok: false,
        body: null,
        error: cause.err.message,
      };
    }

    return {
      ok: false,
      body: null,
      error: 'Authentication error.',
    };
  }
}
