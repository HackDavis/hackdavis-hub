import { NextRequest, NextResponse } from 'next/server';
import { CreatePanel } from '@datalib/panels/createPanels';

export async function POST(request: NextRequest) {
  const body = await request.json();
  if (!body.track)
    return NextResponse.json(
      {
        ok: false,
        body: null,
        error: 'Bad Request: Payload missing track name.',
      },
      { status: 400 }
    );

  const res = await CreatePanel(body.track);
  return NextResponse.json({ ...res }, { status: res.ok ? 201 : 500 });
}
