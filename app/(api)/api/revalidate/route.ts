import authenticated from '@utils/authentication/authenticated';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

async function post() {
  revalidatePath('/');
  revalidatePath('/judges');
  revalidatePath('/admin');

  return NextResponse.json({ ok: true }, { status: 400 });
}

const POST = authenticated(post);

export { POST };
