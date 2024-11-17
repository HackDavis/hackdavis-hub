import { NextRequest, NextResponse } from 'next/server';
import { getEvent } from '@datalib/events/getEvent';

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const res = await getEvent(params.id);
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 500 });
}
