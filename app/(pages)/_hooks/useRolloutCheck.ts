'use client';

import { useState, useEffect } from 'react';
import { getRollout } from '@actions/rollouts/getRollouts';

export default function useRolloutCheck(component_key: string) {
  const [ready, setReady] = useState(false);
  const [rolloutTime, setRolloutTime] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const fetchRolloutAndCheck = async () => {
      setLoading(true);
      setError('');
      setReady(false);

      try {
        const res = await getRollout(component_key);
        if (!res.ok) throw new Error(`Failed to fetch rollout: ${res.error}`);

        const time = res.body.rollout_time;
        setRolloutTime(time);

        const now = Date.now();
        const timeUntil = time - now;

        if (timeUntil <= 0) {
          setReady(true);
        } else {
          timeout = setTimeout(() => {
            fetchRolloutAndCheck();
          }, timeUntil);
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchRolloutAndCheck();

    return () => clearTimeout(timeout);
  }, [component_key]);

  return { ready, rolloutTime, loading, error };
}
