'use server';

import CreateRollout from '@datalib/rollouts/createRollout';
import Rollout from '@typeDefs/rollout';
import { revalidatePath } from 'next/cache';

export async function createRollout(body: Rollout) {
  const response = await CreateRollout(body);
  revalidatePath('/');
  return JSON.parse(JSON.stringify(response));
}
