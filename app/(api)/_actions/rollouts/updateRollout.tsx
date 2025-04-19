'use server';

import { UpdateRollout } from '@datalib/rollouts/updateRollout';
import { revalidatePath } from 'next/cache';

export async function updateRollout(id: string, body: any) {
  const updateRes = await UpdateRollout(id, body);
  revalidatePath('/', 'layout');
  return JSON.parse(JSON.stringify(updateRes));
}
