import { NextRequest, NextResponse } from 'next/server';
import { GetNextTimer } from '@datalib/helpTimers/getHelpTimer';

export async function GET(_: NextRequest) {
  const res = await GetNextTimer();
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 500 });
}
