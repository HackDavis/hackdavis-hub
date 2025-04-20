'use server';

import {
  GetAnnouncement,
  GetManyAnnouncements,
} from '@datalib/announcements/getAnnouncement';

export async function getAnnouncement(id: string) {
  const res = await GetAnnouncement(id);
  return JSON.parse(JSON.stringify(res));
}

export async function getManyAnnouncements(query: object = {}) {
  const res = await GetManyAnnouncements(query);
  return JSON.parse(JSON.stringify(res));
}
