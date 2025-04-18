'use server';

import { CreateAnnouncement } from '@datalib/announcements/createAnnouncement';
import { revalidatePath } from 'next/cache';

export async function createAnnouncement(body: object) {
  const res = await CreateAnnouncement(body);
  revalidatePath('/');
  return res;
}
