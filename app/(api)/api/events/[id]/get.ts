import { NextRequest, NextResponse } from 'next/server';
import { getEvent } from '@datalib/events/getEvent';

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  return NextResponse.json(await getEvent(params.id));
}
