import { NextRequest } from 'next/server';
import { GetJudge } from '@datalib/judges/getJudge';

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  return GetJudge(params.id);
}
