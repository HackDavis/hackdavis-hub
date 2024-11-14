'use server';

import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { signIn } from 'auth';

import { CreateJudge } from '@datalib/judges/createJudge';
import {
  DuplicateError,
  HttpError,
  NotAuthenticatedError,
} from '@utils/response/Errors';
import { GetManyJudges } from '@datalib/judges/getJudge';
import JudgeInt from '@typeDefs/judge';

export async function Register(body: JudgeInt) {
  try {
    const { email, password, ...rest } = body;
    const hashedPassword = await hash(password as string, 10);

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

    // Sign In
    const response = await signIn('credentials', {
      email: email,
      password: password,
      redirect: false,
    });

    if (!response?.ok) {
      throw new NotAuthenticatedError('Invalid login credentials');
    }

    return { ok: true, body: response, error: null, status: 200 };
  } catch (e) {
    const error = e as HttpError;
    return {
      ok: false,
      body: null,
      error: error.message,
      status: error.status || 400,
    };
  }
}
