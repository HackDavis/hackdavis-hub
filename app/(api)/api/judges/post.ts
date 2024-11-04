import { NextRequest } from 'next/server';
import { CreateJudge } from '@datalib/judges/createJudge';

export async function POST(request: NextRequest) {
  const body = await request.json();
  return CreateJudge(body);
}
