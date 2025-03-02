import { NextRequest, NextResponse } from 'next/server';
import { LinkUserToEvent } from '@app/(api)/_datalib/userToEvents/linkUserToEvent';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const res = await LinkUserToEvent(body);
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 500 });
}
