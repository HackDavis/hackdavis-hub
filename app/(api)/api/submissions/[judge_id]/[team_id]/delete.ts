import { NextRequest, NextResponse } from 'next/server';
import { DeleteSubmission } from '@datalib/submissions/deleteSubmission';

export async function DELETE(
  _: NextRequest,
  { params }: { params: { judge_id: string; team_id: string } }
) {
  const res = await DeleteSubmission(params.judge_id, params.team_id);
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 500 });
}
