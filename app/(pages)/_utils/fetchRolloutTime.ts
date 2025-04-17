import { getRollout } from '@actions/rollouts/getRollouts';

// returns null if fetching rollout fails
export default async function fetchRollout(component_key: string) {
  const rolloutRes = await getRollout(component_key);

  if (!rolloutRes.ok || !rolloutRes.body) return null;

  return rolloutRes.body;
}
