'use server';

import { NextResponse } from 'next/server';

import Logout from '@datalib/auth/logout';
import authenticated from '@utils/authentication/authenticated';

async function post() {
  const res = await Logout();
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 401 });
}

export const POST = authenticated(post);
