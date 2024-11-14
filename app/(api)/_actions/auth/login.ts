'use server';

import { Login } from '@datalib/auth/login';
import { HttpError, NotAuthenticatedError } from '@utils/response/Errors';
import FormToJSON from '@utils/form/FormToJSON';

import JudgeInt from '@typeDefs/judge';

export default async function LoginAction(
  prevState: any,
  formData: FormData
): Promise<{
  ok: boolean;
  body?: null;
  error?: string | null;
}> {
  try {
    const body = FormToJSON(formData) as JudgeInt;
    const data = await Login(body);

    if (!data.ok || !data.body) {
      throw new NotAuthenticatedError(data.error as string);
    }

    return { ok: true, body: null, error: null };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
}
