import { NextRequest, NextResponse } from "next/server";
import { DeleteEvent } from "@datalib/events/deleteEvent";

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  const res = await DeleteEvent(params.id);
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 500 });
}
