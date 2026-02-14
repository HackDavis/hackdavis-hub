import checkFeatureAvailability from '@actions/rollouts/checkFeatureAvailability';
import { useEffect, useState, useCallback, useRef } from 'react';

export function useFeatureAvailability(featureId: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [available, setAvailable] = useState(false);
  const [rollout, setRollout] = useState<any>(null);

  const lastFetchedId = useRef<string | null>(null);

  const fetchAvailability = useCallback(
    async (id: string, force = false) => {
      if (!force && lastFetchedId.current === id && rollout !== null) return;

      setLoading(true);
      setError(null);
      try {
        const { ok, body, error } = await checkFeatureAvailability(id);
        if (ok && body) {
          setAvailable(body.available);
          setRollout(body.rollout);
          lastFetchedId.current = id;
        } else {
          setError(error);
        }
      } catch (err: any) {
        console.error('Failed to fetch feature availability:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [rollout]
  );

  useEffect(() => {
    fetchAvailability(featureId);
  }, [featureId, fetchAvailability]);

  return { loading, available, rollout, error, fetchAvailability };
}
