'use client';

import { useState, useEffect } from 'react';
import { getManyUsers } from '@actions/users/getUser';

export function useJudges(): any {
  const [judges, setJudges] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getJudges = async () => {
    const team = await getManyUsers({ role: 'judge' });
    setJudges(team);
    setLoading(false);
  };

  useEffect(() => {
    getJudges();
  }, []);

  return { judges, loading, getJudges };
}
