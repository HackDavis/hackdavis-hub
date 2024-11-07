import { NextRequest, NextResponse } from 'next/server';
import { createEvent } from '@datalib/events/createEvent';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const res = await createEvent(body);
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 500 });
}
