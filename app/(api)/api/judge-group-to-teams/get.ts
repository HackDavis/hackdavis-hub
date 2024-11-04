import { NextRequest, NextResponse } from 'next/server';
import getQueries from '@utils/request/getQueries';
import { GetManyJudgeGroupToTeams } from '@datalib/judgeGroups/getJudgeGroupToTeam';

export async function GET(request: NextRequest) {
  const queries = await getQueries(request, 'judgeGroupToTeams');
  const res = await GetManyJudgeGroupToTeams(queries);
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 500 });
}
