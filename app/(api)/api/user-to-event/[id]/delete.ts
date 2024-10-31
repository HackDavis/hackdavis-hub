import { NextRequest, NextResponse } from 'next/server';
import { DeleteUserToEvent } from '@datalib/user-to-event/deleteUserToEvent';

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  return NextResponse.json(await DeleteUserToEvent(params.id));
}

