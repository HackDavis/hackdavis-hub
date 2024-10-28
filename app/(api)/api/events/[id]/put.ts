import { NextRequest, NextResponse } from 'next/server';
import { updateEvent } from '@datalib/events/updateEvent';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  return NextResponse.json(await updateEvent(params.id, body));
}
