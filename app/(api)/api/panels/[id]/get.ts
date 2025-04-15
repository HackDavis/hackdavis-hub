import { NextResponse, NextRequest } from "next/server";
import { GetPanel } from "@datalib/panels/getPanels";

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  const res = await GetPanel(params.id);
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 500 });
}
