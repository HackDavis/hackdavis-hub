'use server';

import CreateRollout from '@datalib/rollouts/createRollout';
import Rollout from '@typeDefs/rollout';

export async function createRollout(body: Rollout) {
  const response = await CreateRollout(body);
  return JSON.parse(JSON.stringify(response));
}
