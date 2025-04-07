'use client';

import { useState, useEffect } from 'react';
import { getManyUsers } from '@actions/users/getUser';

export function useJudges(): any {
  const [judges, setJudges] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getJudges = async () => {
    const judges = await getManyUsers({ role: 'judge' });
    if (judges.ok) {
      judges.body = judges.body.map((judge: any) => {
        const teamOrder = judge.submissions
          .map((submission: any) => ({
            order: submission.queuePosition,
            team_id: submission.team_id,
          }))
          .sort((a: any, b: any) => a.order - b.order);

        const teamMap = Object.fromEntries(
          judge.teams.map((team: any) => [team._id, team])
        );

        const newTeams = teamOrder.map(({ order, team_id }: any) => ({
          ...teamMap[team_id],
          order,
        }));

        return { ...judge, teams: newTeams };
      });
    }
    setJudges(judges);
    setLoading(false);
  };

  useEffect(() => {
    getJudges();
  }, []);

  return { judges, loading, getJudges };
}
