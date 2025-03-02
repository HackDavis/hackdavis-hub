import { NextRequest, NextResponse } from 'next/server';
import { GetUserToEvents } from '@app/(api)/_datalib/userToEvents/getUserToEvent';
import { ObjectId } from 'mongodb';

export async function GET(
  _: NextRequest,
  { params }: { params: { user_id: string; event_id: string } }
) {
  const query = {
    user_id: new ObjectId(params.user_id),
    event_id: new ObjectId(params.event_id),
  };

  const res = await GetUserToEvents(query);
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 500 });
}
