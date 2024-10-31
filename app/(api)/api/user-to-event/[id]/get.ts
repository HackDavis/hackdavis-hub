import { NextRequest, NextResponse } from 'next/server';
import { GetUserToEvent } from '@datalib/user-to-event/getUserToEvent';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const idType = req.headers.get("idType") || "user_id"; // Determine id type from request headers or default to "user_id"
  const result = await GetUserToEvent(id, idType as 'user_id' | 'event_id');
  return NextResponse.json(result);
}

