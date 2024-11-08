import { NextRequest } from 'next/server';
import { createUserToEvent } from '@datalib/userToEvent/createUserToEvent';

export async function POST(request: NextRequest) {
  const body = await request.json();
  return createUserToEvent(body);
}
