'use client';

import { useState, useEffect } from 'react';
import { getManyTeams } from '@actions/teams/getTeams';

export function useTeams(): any {
  const [teams, setTeams] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getTeams = async () => {
    const team = await getManyTeams();
    setTeams(team);
    setLoading(false);
  };

  useEffect(() => {
    getTeams();
  }, []);

  return { teams, loading, getTeams };
}
