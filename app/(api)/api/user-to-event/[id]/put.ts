import { NextRequest } from 'next/server';
import { UpdateJudge } from '@datalib/judges/updateJudge';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  return UpdateJudge(params.id, body);
}
