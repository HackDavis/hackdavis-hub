'use server';

import DeleteRollout from '@datalib/rollouts/deleteRollout';
import { revalidatePath } from 'next/cache';

export const deleteRollout = async (id: string) => {
  const res = await DeleteRollout(id);
  revalidatePath('/', 'layout');
  return res;
};
