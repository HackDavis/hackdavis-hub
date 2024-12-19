'use server';

import { signOut } from '@/auth';
import { HttpError } from '@utils/response/Errors';

export default async function LogoutAction(): Promise<{
  ok: boolean;
  body?: null;
  error?: string | null;
}> {
  try {
    await signOut({
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
