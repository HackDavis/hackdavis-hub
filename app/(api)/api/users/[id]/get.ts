import { NextRequest, NextResponse } from 'next/server';
import { GetUser } from '@datalib/users/getUser';

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const res = await GetUser(params.id);
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 500 });
}
