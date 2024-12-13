'use server';
import { NextRequest } from 'next/server';

import { Login } from '@datalib/auth/login';
import { HttpError, NotAuthenticatedError } from '@utils/response/Errors';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await Login(body);

    if (!data.ok || !data.body) {
      throw new NotAuthenticatedError(data.error as string);
    }

    return { ok: true, body: null, error: null, status: 200 };
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
