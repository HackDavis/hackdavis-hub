import { NextRequest, NextResponse } from 'next/server';
import { GetManyUsers } from '@datalib/users/getUser';
import getQueries from '@utils/request/getQueries';

export async function GET(request: NextRequest) {
  const queries = await getQueries(request, 'users');
  const res = await GetManyUsers(queries);
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 500 });
}
