import { NextRequest, NextResponse } from 'next/server';
import { LinkUserToEvent } from '@app/(api)/_datalib/userToEvents/linkUserToEvent';

export async function POST(
  request: NextRequest,
  { params }: { params: { user_id: string; event_id: string } }
) {
  const body = await request.json();

  const linkData = {
    ...body,
    user_id: params.user_id,
    event_id: params.event_id,
  };

  const res = await LinkUserToEvent(linkData);
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 500 });
}
