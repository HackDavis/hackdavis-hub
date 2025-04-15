import { NextRequest, NextResponse } from "next/server";
import { UpdateTeam } from "@datalib/teams/updateTeam";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const body = await request.json();
  const res = await UpdateTeam(params.id, body);
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 500 });
}
