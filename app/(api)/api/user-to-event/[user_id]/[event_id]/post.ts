import { NextRequest, NextResponse } from "next/server";
import { LinkUserToEvent } from "@datalib/userToEvents/linkUserToEvent";
import { prepareIdsInQuery } from "@utils/request/parseAndReplace";

export async function POST(
  _: NextRequest,
  { params }: { params: { user_id: string; event_id: string } },
) {
  const res = await LinkUserToEvent(await prepareIdsInQuery(params));
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 500 });
}
