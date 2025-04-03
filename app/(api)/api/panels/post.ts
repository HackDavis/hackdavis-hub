import { NextRequest, NextResponse } from 'next/server';
import { CreatePanel } from '@datalib/panels/createPanels';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { track, type } = body;
  const res = await CreatePanel(track, type);
  return NextResponse.json({ ...res }, { status: res.ok ? 201 : 400 });
}
