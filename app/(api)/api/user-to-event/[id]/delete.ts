import { NextRequest, NextResponse } from 'next/server';
import { DeleteUserToEvent } from '@datalib/user-to-event/deleteUserToEvent';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const result = await DeleteUserToEvent(id);

  // Check if the result was successful or returned an error
  if (result.ok) {
    return NextResponse.json(result, { status: 200 });
  } else {
    return NextResponse.json(result, { status: 400 });
  }
}
