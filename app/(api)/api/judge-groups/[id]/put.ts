import { NextRequest } from 'next/server';
import { UpdateJudgeGroup } from '@datalib/judgeGroups/updateJudgePair';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  return UpdateJudgeGroup(params.id, body);
}
