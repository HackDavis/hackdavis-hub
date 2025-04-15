import { GetSubmission } from '@datalib/submissions/getSubmissions';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _: NextRequest,
  { params }: { params: { judge_id: string; team_id: string } }
) {
  const res = await GetSubmission(params.judge_id, params.team_id);
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 500 });
}
