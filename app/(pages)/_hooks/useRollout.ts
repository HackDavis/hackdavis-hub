'use client';

import { getRollout } from '@actions/rollouts/getRollouts';
import { useEffect, useState } from 'react';

export function useRollout(featureId: string) {
  const [loading, setLoading] = useState(true);
  const [rolloutRes, setRolloutRes] = useState<any>(null);

  const fetchRollout = async (featureId: string) => {
    const res = await getRollout(featureId);
    setRolloutRes(res);
    setLoading(false);
  };

  useEffect(() => {
    fetchRollout(featureId);
  }, [featureId]);

  return { loading, rolloutRes, fetchRollout };
}
