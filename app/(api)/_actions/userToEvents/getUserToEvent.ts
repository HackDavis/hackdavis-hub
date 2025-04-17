'use server';

import { GetUserToEvents } from '@datalib/userToEvents/getUserToEvent';
import { prepareIdsInQuery } from '@utils/request/parseAndReplace';
import { GetEventsWithAttendees } from '@datalib/userToEvents/getEventsWithAttendees';

export async function getEventsForOneUser(user_id: string) {
  const result = await GetUserToEvents(await prepareIdsInQuery({ user_id }));
  return JSON.parse(JSON.stringify(result));
}

export async function getUsersForOneEvent(event_id: string) {
  const result = await GetUserToEvents(await prepareIdsInQuery({ event_id }));
  return JSON.parse(JSON.stringify(result));
}

export async function getEventsWithAttendees() {
  const result = await GetEventsWithAttendees();
  return JSON.parse(JSON.stringify(result));
}
