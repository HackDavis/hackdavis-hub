import { NextRequest, NextResponse } from 'next/server';
import { UpdateSubmission } from '@datalib/submissions/updateSubmission';

export async function PUT(
  request: NextRequest,
  { params }: { params: { judge_id: string; team_id: string } }
) {
  const body = await request.json();
  const res = await UpdateSubmission(params.judge_id, params.team_id, body);
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 500 });
}
