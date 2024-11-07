// DELETE handler
import { NextRequest, NextResponse } from 'next/server';
import { DeleteUserToEvent } from '@datalib/user-to-event/deleteUserToEvent';

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  // Return the response from DeleteUserToEvent
  return DeleteUserToEvent(params.id);
}

/* export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // Create the query object to pass to DeleteUserToEvent
  const query = { _id: id };

  const result = await DeleteUserToEvent(query);

  // Check if the result was successful or returned an error
  if (result.ok) {
    return NextResponse.json(result, { status: 200 });
  } else {
    return NextResponse.json(result, { status: 400 });
  }
} */
