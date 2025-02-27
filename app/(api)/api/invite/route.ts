import { NextRequest, NextResponse } from 'next/server';
import GenerateInvite from '@datalib/auth/generateInvite';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const res = await GenerateInvite(body.data);
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 401 });
}
