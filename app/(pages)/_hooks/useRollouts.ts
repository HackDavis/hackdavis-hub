'use client';

import { getManyRollouts } from '@actions/rollouts/getRollouts';
import { useEffect, useState } from 'react';

export default function useRollouts() {
  const [loading, setLoading] = useState(true);
  const [rolloutsRes, setRolloutsRes] = useState<any>(null);

  const fetchRollouts = async () => {
    setLoading(true);
    const rolloutsRes = await getManyRollouts();
    setRolloutsRes(rolloutsRes);
    setLoading(false);
  };

  useEffect(() => {
    fetchRollouts();
  }, []);

  return { loading, rolloutsRes, fetchRollouts };
}
