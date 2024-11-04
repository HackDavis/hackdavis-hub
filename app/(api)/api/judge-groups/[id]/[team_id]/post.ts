import { NextRequest, NextResponse } from 'next/server';
import { LinkJudgeGroupToTeam } from '@datalib/judgeGroups/linkJudgeGroupToTeam';

export async function POST(
  _: NextRequest,
  { params }: { params: { id: string; team_id: string } }
) {
  const res = await LinkJudgeGroupToTeam({
    judge_group_id: params.id,
    team_id: params.team_id,
  });
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 500 });
}
