'use server';
import bcrypt from 'bcryptjs';

import { HttpError, NotAuthenticatedError } from '@utils/response/Errors';
import { GetManyJudges } from '@datalib/judges/getJudge';
import { createAuthToken } from './authToken';

export async function Login(body: { email: string; password: string }) {
  try {
    const { email, password } = body;

    // Find Judge
    const data = await GetManyJudges({ email });
    if (!data.ok || data.body.length === 0) {
      throw new NotAuthenticatedError('Judge not found');
    }

    const judge = data.body[0];

    const isPasswordValid = await bcrypt.compare(
      password as string,
      judge.password
    );

    if (!isPasswordValid) {
      throw new NotAuthenticatedError('Email or Password do not match');
    }

    const token = await createAuthToken(judge);
    return { ok: true, body: token, error: null };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
}
