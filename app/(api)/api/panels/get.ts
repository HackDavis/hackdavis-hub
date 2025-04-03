import { NextResponse } from 'next/server';
import { GetAllPanels } from '@datalib/panels/createPanels';

export async function GET() {
  const res = await GetAllPanels();
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 500 });
}
