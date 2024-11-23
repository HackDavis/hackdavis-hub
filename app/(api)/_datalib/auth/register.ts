'use server';
import bcrypt from 'bcryptjs';

import { CreateJudge } from '@datalib/judges/createJudge';
import { DuplicateError, HttpError } from '@utils/response/Errors';
import { GetManyJudges } from '@datalib/judges/getJudge';
import { createAuthToken } from './authToken';
import User from '@typeDefs/user';

export async function Register(body: User) {
  try {
    const { email, password, ...rest } = body;
    const hashedPassword = await bcrypt.hash(password as string, 10);

    // Find Judge
    const judgeData = await GetManyJudges({ email });
    if (!judgeData.ok || judgeData.body.length !== 0) {
      throw new DuplicateError('Judge already exists');
    }

    // Create Judge
    const data = await CreateJudge({
      email,
      password: hashedPassword,
      ...rest,
    });

    if (!data.ok) {
      throw new HttpError('Failed to create judge');
    }

    const token = await createAuthToken(data.body);
    return { ok: true, body: token, error: null };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, error: error.message };
  }
}
