'use server';

import { NextRequest, NextResponse } from 'next/server';

import Login from '@datalib/auth/login';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const res = await Login(body.email, body.password);
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 401 });
}
