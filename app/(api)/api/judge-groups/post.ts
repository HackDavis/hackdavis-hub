import { NextRequest, NextResponse } from 'next/server';
import { CreateJudgeGroup } from '@datalib/judgeGroups/createJudgeGroup';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const res = await CreateJudgeGroup(body);
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 500 });
}
