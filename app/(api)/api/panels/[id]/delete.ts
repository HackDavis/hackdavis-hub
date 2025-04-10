import { NextRequest, NextResponse } from 'next/server';
import { DeletePanel } from '@datalib/panels/deletePanel';

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const res = await DeletePanel(params.id);
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 500 });
}
