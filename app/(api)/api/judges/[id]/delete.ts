import { NextRequest, NextResponse } from 'next/server';
import { DeleteJudge } from '@datalib/judges/deleteJudge';

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const res = await DeleteJudge(params.id);
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 500 });
}
