'use server';

import { NextResponse, NextRequest } from 'next/server';

import Logout from '@datalib/auth/logout';
import authenticated from '@utils/authentication/authenticated';

export const POST = authenticated(async () => {
  const res = await Logout();
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 401 });
});
