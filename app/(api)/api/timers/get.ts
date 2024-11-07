import { NextRequest, NextResponse } from 'next/server';

import getQueries from '@utils/request/getQueries';
import { GetHelpTimers } from '@datalib/helpTimers/getHelpTimer';

export async function GET(request: NextRequest) {
  const queries = await getQueries(request, 'helpTimers');
  const res = await GetHelpTimers(queries);
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 500 });
}
