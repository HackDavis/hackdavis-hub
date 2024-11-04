import { NextRequest, NextResponse } from 'next/server';
import { GetJudge } from '@datalib/judges/getJudge';

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const res = await GetJudge(params.id);
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 500 });
}
