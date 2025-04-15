import { NextRequest, NextResponse } from "next/server";
import { UpdatePanel } from "@datalib/panels/updatePanel";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const body = await request.json();
  const res = await UpdatePanel(params.id, body);
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 500 });
}
