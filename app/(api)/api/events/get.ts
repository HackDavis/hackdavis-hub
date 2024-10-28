import { NextRequest, NextResponse } from 'next/server';
import { getEvents } from '@datalib/events/getEvent';
import getQueries from '@utils/request/getQueries';

export async function GET(request: NextRequest) {
  const queries = await getQueries(request, 'events');
  return NextResponse.json(await getEvents(queries));
}
