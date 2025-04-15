import { NextRequest, NextResponse } from "next/server";
import { CreateEvent } from "@datalib/events/createEvent";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const res = await CreateEvent(body);
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 500 });
}
