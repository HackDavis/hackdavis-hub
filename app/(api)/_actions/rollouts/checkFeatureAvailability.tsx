'use server';

import { GetRollout } from '@datalib/rollouts/getRollout';
import Rollout from '@typeDefs/rollout';

export default async function checkFeatureAvailability(component_key: string) {
  try {
    const rolloutRes = await GetRollout(component_key);

    if (!rolloutRes.ok || !rolloutRes.body) {
      throw new Error(rolloutRes.error ?? 'Feature not found.');
    }

    const rollout: Rollout = rolloutRes.body;

    if (Date.now() < rollout.rollout_time) {
      throw new Error('Feature is not available yet.');
    }

    if (rollout.rollback_time && Date.now() > rollout.rollback_time) {
      throw new Error('Feature is no longer available.');
    }

    return {
      ok: true,
      body: rollout,
      error: null,
    };
  } catch (e) {
    const error = e as Error;
    return {
      ok: false,
      body: null,
      error: error.message,
    };
  }
}
