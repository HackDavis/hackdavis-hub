'use server';

import CreateRollout from '@datalib/rollouts/createRollout';
import { revalidatePath } from 'next/cache';

export async function createRollout(body: any) {
  const response = await CreateRollout(body);
  revalidatePath('/', 'layout');
  return JSON.parse(JSON.stringify(response));
}
