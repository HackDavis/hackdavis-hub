import { CreateHelpTimer } from '@datalib/helpTimers/createHelpTimer';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const res = await CreateHelpTimer(body);
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 500 });
}
