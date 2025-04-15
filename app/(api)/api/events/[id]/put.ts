import { NextRequest, NextResponse } from "next/server";
import { UpdateEvent } from "@datalib/events/updateEvent";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const body = await request.json();
  const res = await UpdateEvent(params.id, body);
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 500 });
}
