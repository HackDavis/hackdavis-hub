import { NextRequest, NextResponse } from 'next/server';
import { deleteEvent } from '@datalib/events/deleteEvent';

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  return NextResponse.json(await deleteEvent(params.id));
}
