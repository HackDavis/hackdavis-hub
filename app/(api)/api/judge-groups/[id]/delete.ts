import { NextRequest, NextResponse } from 'next/server';
import { DeleteJudgeGroup } from '@datalib/judgeGroups/deleteJudgeGroup';

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const res = await DeleteJudgeGroup(params.id);
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 500 });
}
