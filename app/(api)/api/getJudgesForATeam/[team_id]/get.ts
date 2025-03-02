import { NextRequest, NextResponse } from 'next/server';
import { getJudgesForATeam } from '@app/(api)/_actions/teams/getJudgesForATeam';

export async function GET(
  _: NextRequest,
  { params }: { params: { team_id: string } }
) {
  const res = await getJudgesForATeam(params.team_id);
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 500 });
}