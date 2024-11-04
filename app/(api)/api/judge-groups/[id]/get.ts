import { NextRequest, NextResponse } from 'next/server';
import { GetJudgeGroup } from '@datalib/judgeGroups/getJudgeGroup';

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const res = await GetJudgeGroup(params.id);
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 500 });
}
