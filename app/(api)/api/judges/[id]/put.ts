import { NextRequest, NextResponse } from 'next/server';
import { UpdateJudge } from '@datalib/judges/updateJudge';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const res = await UpdateJudge(params.id, body);
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 500 });
}
