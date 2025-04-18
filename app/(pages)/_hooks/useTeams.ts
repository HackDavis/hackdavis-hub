'use client';

import { useState, useEffect } from 'react';
import { getManyTeams } from '@actions/teams/getTeams';

export function useTeams(query: object = {}): {
  teams: any[];
  loading: boolean;
} {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getTeamsWrapper = async (query: object) => {
      const result = await getManyTeams(query);
      setTeams(result.body || []);
      setLoading(false);
    };
    getTeamsWrapper(query);
  }, [query]);

  return { teams, loading };
}
