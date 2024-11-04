import { NextRequest, NextResponse } from 'next/server';
import { UpdateJudgeGroup } from '@datalib/judgeGroups/updateJudgeGroup';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const res = await UpdateJudgeGroup(params.id, body);
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 500 });
}
