'use server';

import { revalidatePath } from 'next/cache';
import { DeleteAnnouncement } from '@datalib/announcements/deleteAnnouncement';

export async function deleteAnnouncement(id: string) {
  const res = await DeleteAnnouncement(id);
  revalidatePath('/');
  return res;
}
