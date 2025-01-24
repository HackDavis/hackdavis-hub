import { NextRequest, NextResponse } from 'next/server';
import { DeleteUserToEvent } from '@datalib/userToEvents/deleteUserToEvent';

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string; event_id: string } }
) {
  const res = await DeleteUserToEvent({
    user_id: params.id,
    event_id: params.event_id,
  });
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 500 });
}
