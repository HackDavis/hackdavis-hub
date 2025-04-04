'use server';

import { GetUserToEvents } from '@datalib/userToEvents/getUserToEvent';
import { prepareIdsInQuery } from '@utils/request/parseAndReplace';

export async function getEventsForOneUser(user_id: string) {
  const result = await GetUserToEvents(await prepareIdsInQuery({ user_id }));
  return result;
}

export async function getUsersForOneEvent(event_id: string) {
  console.log('Server action received event_id:', event_id);
  console.log('Event ID type:', typeof event_id);

  const result = await GetUserToEvents(await prepareIdsInQuery({ event_id }));
  return result;
}
