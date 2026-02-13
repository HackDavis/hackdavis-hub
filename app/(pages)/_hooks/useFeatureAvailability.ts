import checkFeatureAvailability from '@actions/rollouts/checkFeatureAvailability';
import { useEffect, useState, useCallback, useRef } from 'react';

export function useFeatureAvailability(featureId: string) {
  const [loading, setLoading] = useState(true);
  const [available, setAvailable] = useState(false);
  const [rollout, setRollout] = useState<any>(null);

  const lastFetchedId = useRef<string | null>(null);

  const fetchAvailability = useCallback(
    async (id: string) => {
      if (lastFetchedId.current === id && rollout !== null) return;

      setLoading(true);
      try {
        const { ok, body } = await checkFeatureAvailability(id);
        if (ok && body) {
          setAvailable(body.available);
          setRollout(body.rollout);
          lastFetchedId.current = id;
        }
      } finally {
        setLoading(false);
      }
    },
    [rollout]
  );

  useEffect(() => {
    fetchAvailability(featureId);
  }, [featureId, fetchAvailability]);

  return { loading, available, rollout, fetchAvailability };
}
