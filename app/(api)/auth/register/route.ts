'use server';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import jwt from 'jsonwebtoken';
import { HttpError } from '@utils/response/Errors';
import type AuthToken from '@typeDefs/authToken';
import { Register } from '@datalib/auth/register';
import { GetManyUsers } from '@datalib/users/getUser';
import getQueries from '@utils/request/getQueries';
import { verifyHMACSignature } from '@utils/invite/hmac';

export async function POST(request: NextRequest) {
  try {
    const { data: d, sig: s } = await getQueries(request, 'users');

    const users = await GetManyUsers();

    const verified = verifyHMACSignature(d as string, s as string);
    if (users.body?.length !== 0 && !verified) {
      throw new HttpError('Bad Invite Token');
    }

    // TODO: rework for hacker registration
    const body = await request.json();
    if (d) {
      const dd = atob(d);
      const parsed = JSON.parse(dd);
      body['email'] = parsed?.email ?? body.email;
      body['name'] = parsed?.name ?? body.name;
      body['specialty'] = parsed?.specialty ?? body.specialty;
      body['role'] = parsed?.role ?? body.role;
    }

    const data = await Register(body);

    if (!data.ok || !data.body) {
      throw new HttpError(data.error as string);
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
