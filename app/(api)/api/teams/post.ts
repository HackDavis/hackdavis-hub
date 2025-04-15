import { NextRequest, NextResponse } from 'next/server';
import { CreateManyTeams } from '@datalib/teams/createTeams';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const res = await CreateManyTeams(body);
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 500 });
}
