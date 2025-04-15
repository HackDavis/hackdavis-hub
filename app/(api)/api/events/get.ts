import { NextRequest, NextResponse } from "next/server";
import { GetEvents } from "@datalib/events/getEvent";
import getQueries from "@utils/request/getQueries";

export async function GET(request: NextRequest) {
  const queries = await getQueries(request, "events");
  const res = await GetEvents(queries);
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 500 });
}
