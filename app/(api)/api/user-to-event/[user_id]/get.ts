import { NextRequest, NextResponse } from 'next/server';
import { GetUserToEvents } from '@datalib/userToEvents/getUserToEvent';
import { prepareIdsInQuery } from '@utils/request/parseAndReplace';

export async function GET(
  _: NextRequest,
  { params }: { params: { user_id: string } }
) {
  const query = await prepareIdsInQuery(params);
  const res = await GetUserToEvents(query);
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 500 });
}
