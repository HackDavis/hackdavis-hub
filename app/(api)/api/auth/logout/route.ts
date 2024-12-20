'use server';

import { NextResponse } from 'next/server';

import Logout from '@datalib/auth/logout';

export async function POST() {
  const res = await Logout();
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 401 });
}
