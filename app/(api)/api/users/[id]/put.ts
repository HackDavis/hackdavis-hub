import { NextRequest, NextResponse } from "next/server";
import { UpdateUser } from "@datalib/users/updateUser";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const body = await request.json();
  const res = await UpdateUser(params.id, body);
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 500 });
}
