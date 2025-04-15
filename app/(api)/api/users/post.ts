import { NextRequest, NextResponse } from "next/server";
import { CreateUser } from "@datalib/users/createUser";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const res = await CreateUser(body);
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 500 });
}
