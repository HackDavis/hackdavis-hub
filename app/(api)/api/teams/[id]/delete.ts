import { NextRequest, NextResponse } from 'next/server';
import { DeleteTeam } from '@datalib/teams/deleteTeam';

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const res = await DeleteTeam(params.id);
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 500 });
}
