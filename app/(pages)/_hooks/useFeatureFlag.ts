'use client';

import { useState, useEffect, useCallback } from 'react';
import checkFeatureAvailability from '@actions/rollouts/checkFeatureAvailability';

export function useFeatureFlag(featureId: string) {
  const [available, setAvailable] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchFeatureAvailability = useCallback(async () => {
    const res = await checkFeatureAvailability(featureId);
    setAvailable(res.ok);
    setLoading(false);
  }, [featureId]);

  useEffect(() => {
    fetchFeatureAvailability();
  }, [fetchFeatureAvailability]);

  return { available, loading, fetchFeatureAvailability };
}
