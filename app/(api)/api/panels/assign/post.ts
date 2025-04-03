import { NextResponse } from 'next/server';
import { AssignJudgesToPanels } from '@datalib/panels/createPanels';

export async function POST() {
  const res = await AssignJudgesToPanels();
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 500 });
}
