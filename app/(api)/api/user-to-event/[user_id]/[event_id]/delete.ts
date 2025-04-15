import { NextRequest, NextResponse } from "next/server";
import { DeleteUserToEvent } from "@datalib/userToEvents/deleteUserToEvent";
import { prepareIdsInQuery } from "@utils/request/parseAndReplace";

export async function DELETE(
  _: NextRequest,
  { params }: { params: { user_id: string; event_id: string } },
) {
  const res = await DeleteUserToEvent(await prepareIdsInQuery(params));
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 500 });
}
