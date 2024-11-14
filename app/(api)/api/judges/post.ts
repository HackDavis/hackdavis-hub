import { NextRequest, NextResponse } from 'next/server';
import { CreateJudge } from '@datalib/judges/createJudge';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const res = await CreateJudge(body);
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 500 });
}
