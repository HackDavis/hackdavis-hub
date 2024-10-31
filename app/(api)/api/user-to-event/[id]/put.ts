import { NextRequest, NextResponse } from 'next/server';
import { updateUserToEvent } from '@datalib/user-to-event/updateUserToEvent';

export async function PUT(req: Request, { params }: { params: { userId: string; eventId: string } }) {
  const { userId, eventId } = params;
  const body = await req.json();
  const result = await updateUserToEvent(userId, eventId, body);
  return NextResponse.json(result);
}
