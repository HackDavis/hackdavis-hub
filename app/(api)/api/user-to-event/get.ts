import { NextRequest, NextResponse } from 'next/server';
import { GetUserToEvent } from '@datalib/user-to-event/getUserToEvent';
import getQueries from '@utils/request/getQueries';

export async function GET(request: NextRequest) {
  const queries = await getQueries(request, 'events');
  
  const id = queries.id as string;
  const idType = queries.idType as 'user_id' | 'event_id';

  if (!id || !idType) {
    return NextResponse.json(
      { ok: false, body: null, error: "Missing 'id' or 'idType' in query parameters" },
      { status: 400 }
    );
  }

  return await GetUserToEvent(id, idType);
}
