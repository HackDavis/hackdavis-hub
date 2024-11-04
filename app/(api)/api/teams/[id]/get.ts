import { NextRequest, NextResponse } from 'next/server';
import { GetTeam } from '@datalib/teams/getTeam';

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const res = await GetTeam(params.id);
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 500 });
}
