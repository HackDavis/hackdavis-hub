'use server';

import { LinkUserToEvent } from '@datalib/userToEvents/linkUserToEvent';
import { prepareIdsInQuery } from '@utils/request/parseAndReplace';

export async function createUserToEvent(user_id: string, event_id: string) {
  const result = await LinkUserToEvent(
    await prepareIdsInQuery({ user_id, event_id })
  );
  return JSON.parse(JSON.stringify(result));
}
