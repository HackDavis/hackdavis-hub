'use server';

import { GetRollout } from '@datalib/rollouts/getRollout';
import Rollout from '@typeDefs/rollout';

export default async function checkFeatureAvailability(component_key: string) {
  try {
    const rolloutRes = JSON.parse(
      JSON.stringify(await GetRollout(component_key))
    );

    if (!rolloutRes.ok || !rolloutRes.body) {
      throw new Error(rolloutRes.error ?? 'Feature not found.');
    }

    const rollout: Rollout = rolloutRes.body;

    const startTime = Number(rollout.rollout_time);
    const endTime = Number(rollout.rollback_time) || Infinity;
    const now = Date.now();
    const available = startTime <= now && now <= endTime;

    return {
      ok: true,
      body: {
        available,
        rollout: {
          ...rollout,
          rollout_time: startTime,
          rollback_time: endTime === Infinity ? null : endTime,
        },
      },
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
