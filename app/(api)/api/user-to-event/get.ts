import { NextRequest, NextResponse } from 'next/server';
import { GetUserToEvents } from '@datalib/userToEvents/getUserToEvent';
import getQueries from '@utils/request/getQueries';
import { prepareIdsInQuery } from '@utils/request/parseAndReplace';

export async function GET(request: NextRequest) {
  const queries = await getQueries(request, 'userToEvents');
  const res = await GetUserToEvents(await prepareIdsInQuery(queries));
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 500 });
}
