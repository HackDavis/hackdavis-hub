'use server';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import jwt from 'jsonwebtoken';
import { Login } from '@datalib/auth/login';
import { HttpError, NotAuthenticatedError } from '@utils/response/Errors';
import type AuthToken from '@typeDefs/authToken';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
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

    return NextResponse.json({ ok: true, body: payload }, { status: 200 });
  } catch (e) {
    const error = e as HttpError;
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: error.status || 400 }
    );
  }
}
