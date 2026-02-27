import { NextRequest, NextResponse } from 'next/server';
import { askHackbot } from '@actions/hackbot/askHackbot';
import type { HackbotMessage } from '@typeDefs/hackbot';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const messages = (body?.messages ?? []) as HackbotMessage[];

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          answer: '',
          error: 'Invalid request body. Expected { messages: [...] }.',
        },
        { status: 400 }
      );
    }

    const result = await askHackbot(messages);

    return NextResponse.json(
      {
        ok: result.ok,
        answer: result.answer,
        url: result.url,
        usage: result.usage ?? null,
        error: result.error ?? null,
      },
      { status: result.ok ? 200 : 400 }
    );
  } catch (e) {
    return NextResponse.json(
      {
        ok: false,
        answer: '',
        error: 'Invalid JSON body.',
      },
      { status: 400 }
    );
  }
}
