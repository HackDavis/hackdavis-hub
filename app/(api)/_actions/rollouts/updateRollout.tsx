'use server';

import { UpdateRollout } from '@datalib/rollouts/updateRollout';
import Rollout from '@typeDefs/rollout';

export default async function updateRollout(id: string, body: Rollout) {
  const { _id: _, ...rest } = body;
  return await UpdateRollout(id, { $set: rest });
}
