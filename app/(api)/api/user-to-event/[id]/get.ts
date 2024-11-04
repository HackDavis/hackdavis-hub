// app/api/userToEvent/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GetUserToEvent } from '@datalib/user-to-event/getUserToEvent';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const idType = req.headers.get("idType") || "user_id"; // Default to "user_id" if no header is provided
  
  // Validate idType to ensure it's either 'user_id' or 'event_id'
  if (idType !== 'user_id' && idType !== 'event_id') {
    return NextResponse.json(
      { ok: false, body: null, error: 'Invalid idType provided. Use "user_id" or "event_id".' },
      { status: 400 }
    );
  }

  const result = await GetUserToEvent({ id, idType: idType as 'user_id' | 'event_id' });
  return result; 
}
