import { NextRequest, NextResponse } from 'next/server';
import { LinkUserToEvent } from '@datalib/userToEvents/linkUserToEvent';

export async function POST(
  _: NextRequest,
  { params }: { params: { id: string; event_id: string } }
) {
  const res = await LinkUserToEvent({
    user_id: params.id,
    event_id: params.event_id,
  });
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 500 });
}
