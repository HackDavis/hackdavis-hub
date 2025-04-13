'use server';

import { GetEvent, GetEvents } from '@datalib/events/getEvent';

export async function getEvent(id: string) {
  const response = await GetEvent(id);
  return JSON.parse(JSON.stringify(response));
}

export async function getEvents(body: object) {
  const response = await GetEvents(body);
  return JSON.parse(JSON.stringify(response));
}
