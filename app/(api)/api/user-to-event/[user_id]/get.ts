import { NextRequest, NextResponse } from 'next/server';
import { GetUserToEvents } from '@app/(api)/_datalib/userToEvents/getUserToEvent';
import { ObjectId } from 'mongodb';

export async function GET(
  _: NextRequest,
  { params }: { params: { user_id: string } }
) {
  try {
    const query = {
      user_id: new ObjectId(params.user_id),
    };

    const res = await GetUserToEvents(query);

    return NextResponse.json({ ...res }, { status: res.ok ? 200 : 500 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: 'Failed to retrieve user events' },
      { status: 500 }
    );
  }
}
