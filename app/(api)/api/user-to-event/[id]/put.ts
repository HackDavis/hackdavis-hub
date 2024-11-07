import { NextRequest, NextResponse } from 'next/server';
import { updateUserToEvent } from '@datalib/userToEvent/updateUserToEvent';

export async function PUT(request: NextRequest, { params }: { params: { userId: string; eventId: string } }) {
  const { userId, eventId } = params;
  const body = await request.json();
  return updateUserToEvent(userId, eventId, body);
}
