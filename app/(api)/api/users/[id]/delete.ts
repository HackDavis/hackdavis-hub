import { NextRequest, NextResponse } from 'next/server';
import { DeleteUser } from '@datalib/users/deleteUser';

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const res = await DeleteUser(params.id);
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 500 });
}
