import { NextRequest, NextResponse } from "next/server";
import { GetEvent } from "@datalib/events/getEvent";

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  const res = await GetEvent(params.id);
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 500 });
}
