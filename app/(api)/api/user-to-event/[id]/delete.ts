// DELETE handler
import { NextRequest } from 'next/server';
import { DeleteUserToEvent } from '@datalib/userToEvent/deleteUserToEvent';

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  // Return the response from DeleteUserToEvent
  return DeleteUserToEvent(params.id);
}
