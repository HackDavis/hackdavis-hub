'use server';

import { GetRollout, GetManyRollouts } from '@datalib/rollouts/getRollout';
import { serializeMongoData } from '@utils/serialize/serialization';

export async function getRollout(component_key: string) {
  const rollout = await GetRollout(component_key);
  return JSON.parse(JSON.stringify(rollout));
}

export async function getManyRollouts(query: object = {}) {
  const rolloutRes = await GetManyRollouts(query);
  return JSON.parse(JSON.stringify(rolloutRes));
}
