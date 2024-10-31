import { NextRequest } from 'next/server';
import { DeleteJudge } from '@datalib/judges/deleteJudge';

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  return DeleteJudge(params.id);
}
