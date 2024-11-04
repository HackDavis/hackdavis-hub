import { NextRequest, NextResponse } from 'next/server';
import getQueries from '@utils/request/getQueries';
import { GetManyJudgeGroups } from '@datalib/judgeGroups/getJudgeGroup';

export async function GET(request: NextRequest) {
  const queries = await getQueries(request, 'judgeGroups');
  const res = await GetManyJudgeGroups(queries);
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 500 });
}
