import checkFeatureAvailability from '@actions/rollouts/checkFeatureAvailability';
import { useEffect, useState } from 'react';

export function useFeatureAvailability(featureId: string) {
  const [loading, setLoading] = useState(true);
  const [ok, setOk] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [available, setAvailable] = useState<any>(null);
  const [rollout, setRollout] = useState<any>(null);

  const fetchAvailability = async (featureId: string) => {
    setLoading(true);
    const { ok, body, error } = await checkFeatureAvailability(featureId);
    setOk(ok);
    setAvailable(body?.available);
    setRollout(body?.rollout);
    setError(error);
    setLoading(false);
  };

  useEffect(() => {
    fetchAvailability(featureId);
  }, [featureId]);

  return { ok, loading, available, rollout, error, fetchAvailability };
}
