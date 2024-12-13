'use server';

import { Register } from '@datalib/auth/register';
import { CreateJudge } from '@datalib/judges/createJudge';
import { HttpError, NotAuthenticatedError } from '@utils/response/Errors';

export default async function RegisterAction(
  email?: FormDataEntryValue | null,
  password?: FormDataEntryValue | null
): Promise<{
  ok: boolean;
  body?: null;
  error?: string | null;
}> {
  try {
    const data = await CreateJudge();

    if (!data.ok || !data.body) {
      throw new NotAuthenticatedError(data.error as string);
    }

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
