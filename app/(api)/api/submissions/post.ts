import { CreateSubmission } from '@datalib/submissions/createSubmission';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const res = await CreateSubmission(body);
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 500 });
}
