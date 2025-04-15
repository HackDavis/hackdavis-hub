'use client';

import { useState, useEffect } from 'react';
import { getTeam } from '@actions/teams/getTeams';

export function useTeam(team_id: string): any {
  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const getTeamWrapper = async (team_id: string) => {
      const team = await getTeam(team_id);
      setTeam(team);
      setLoading(false);
    };
    getTeamWrapper(team_id);
  }, [team_id]);

  return { team, loading };
}
