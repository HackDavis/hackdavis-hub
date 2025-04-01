'use server';

import { GetEvent, GetEvents } from '@datalib/events/getEvent';

export async function getEvent(id: string) {
  const response = await GetEvent(id);
  return response;
}

export async function getEvents(body: object) {
  const response = await GetEvents(body);
  return response;
}
