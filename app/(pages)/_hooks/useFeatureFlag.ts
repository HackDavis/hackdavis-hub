'use client';

import { useState, useEffect } from 'react';
import checkFeatureAvailability from '@actions/rollouts/checkFeatureAvailability';

export function useFeatureFlag(featureId: string) {
  const [available, setAvailable] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAvailability() {
      const res = await checkFeatureAvailability(featureId);
      setAvailable(res.ok);
      setLoading(false);
    }

    checkAvailability();
  }, [featureId]);

  return { available, loading };
}
