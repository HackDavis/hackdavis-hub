import { NextRequest, NextResponse } from 'next/server';
import { GetManyJudges } from '@datalib/judges/getJudge';
import getQueries from '@utils/request/getQueries';

export async function GET(request: NextRequest) {
  const queries = await getQueries(request, 'judges');
  const res = await GetManyJudges(queries);
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 500 });
}
