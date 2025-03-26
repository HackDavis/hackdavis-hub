'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

import { getManySubmissions } from '@actions/submissions/getSubmission';
import { getManyTeams } from '@actions/teams/getTeams';

export function useSubmissions(): any {
  const { data: session, status } = useSession();
  const user = session?.user;
  const [submissions, setSubmissions] = useState<any>(null);
  const [teams, setTeams] = useState<any>(null);
  const [judgedTeams, setJudgedTeams] = useState<any>([]);
  const [unjudgedTeams, setUnjudgedTeams] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const getSubmissionsWrapper = async (judge_id: string) => {
      const submissions = await getManySubmissions({
        judge_id: {
          '*convertId': {
            id: judge_id,
          },
        },
      });

      const subs = submissions.ok ? submissions.body : [];
      const team_ids = subs.map((body: { team_id: string }) => body.team_id);

      const teams_res = await getManyTeams({
        _id: {
          $in: {
            '*convertIds': {
              ids: team_ids,
            },
          },
        },
      });

      const teams = teams_res.ok ? teams_res.body : [];

      const judgedSubmissions = subs.filter((sub: { scores?: number[] }) =>
        sub.scores ? true : false
      );

      const unjudgedSubmissions = subs.filter((sub: { scores?: number[] }) =>
        sub.scores ? false : true
      );

      const judgedTeamIds = judgedSubmissions.map(
        (sub: { team_id: string }) => sub.team_id
      );

      const unjudgedTeamIds = unjudgedSubmissions.map(
        (sub: { team_id: string }) => sub.team_id
      );

      const judgedTeams = teams.filter((team: { _id: string }) =>
        judgedTeamIds.includes(team._id)
      );

      const unjudgedTeams = teams.filter((team: { _id: string }) =>
        unjudgedTeamIds.includes(team._id)
      );

      setTeams(teams_res);
      setJudgedTeams(judgedTeams);
      setUnjudgedTeams(unjudgedTeams);
      setSubmissions(submissions);
      setLoading(false);
    };
    if (status === 'authenticated' && user) {
      getSubmissionsWrapper(user.id ?? '');
    }
  }, [status, user]);

  return { submissions, teams, judgedTeams, unjudgedTeams, loading };
}
