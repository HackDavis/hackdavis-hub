'use server';

import { LinkUserToEvent } from '@datalib/userToEvents/linkUserToEvent';

export async function createUserToEvent(user_id: string, event_id: string) {
  const result = await LinkUserToEvent({
    user_id: user_id,
    event_id: event_id,
  });

  return result;
}
