'use server';

import { signIn } from '@/auth';
import { HttpError } from '@utils/response/Errors';

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
  } catch (e) {
    const error = e as HttpError;
    return {
      ok: false,
      body: null,
      error: error.message,
    };
  }
}
