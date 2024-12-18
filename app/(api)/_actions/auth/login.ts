'use server';

import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { Login } from '@datalib/auth/login';
import { HttpError, NotAuthenticatedError } from '@utils/response/Errors';
import FormToJSON from '@utils/form/FormToJSON';

import type AuthToken from '@typeDefs/authToken';
import User from '@typeDefs/user';

export default async function LoginAction(
  prevState: any,
  formData: FormData
): Promise<{
  ok: boolean;
  body?: AuthToken | null;
  error?: string | null;
}> {
  try {
    const body = FormToJSON(formData) as User;
    const data = await Login(body);

    if (!data.ok || !data.body) {
      throw new NotAuthenticatedError(data.error as string);
    }

    const payload = jwt.decode(data.body) as AuthToken;

    cookies().set({
      name: 'auth_token',
      value: data.body,
      expires: payload.exp * 1000,
      secure: true,
      httpOnly: true,
    });

    return { ok: true, body: payload || null, error: null };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
}
