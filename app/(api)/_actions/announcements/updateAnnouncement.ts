'use server';

import { revalidatePath } from 'next/cache';
import { UpdateAnnouncement } from '@datalib/announcements/updateAnnouncement';

export async function updateAnnouncement(id: string, body: object) {
  const res = await UpdateAnnouncement(id, body);
  revalidatePath('/');
  return res;
}
