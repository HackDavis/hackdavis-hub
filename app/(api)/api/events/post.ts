import { NextRequest, NextResponse } from 'next/server';
import { createEvent } from '@datalib/events/createEvent';

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json(await createEvent(body));
}
