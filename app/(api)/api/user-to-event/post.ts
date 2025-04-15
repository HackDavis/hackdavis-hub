import { NextRequest, NextResponse } from "next/server";
import { LinkUserToEvent } from "@datalib/userToEvents/linkUserToEvent";
import { prepareIdsInQuery } from "@utils/request/parseAndReplace";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const res = await LinkUserToEvent(await prepareIdsInQuery(body));
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 500 });
}
