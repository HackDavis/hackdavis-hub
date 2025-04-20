'use client';

import { useState, useEffect, useCallback } from 'react';
import { getManyTeams } from '@actions/teams/getTeams';
import Team from '@typeDefs/team';
import User from '@typeDefs/user';
import Submission from '@typeDefs/submission';
import { HttpError } from '@utils/response/Errors';
import { getManySubmissions } from '@actions/submissions/getSubmission';
import { getManyUsers } from '@actions/users/getUser';

interface HydratedJudge extends User {
  queuePosition: number;
  isScored: boolean;
}

export function useTeamJudgesFromTableNumber(tableNumber: number): any {
  const [team, setTeam] = useState<Team | null>(null);
  const [judges, setJudges] = useState<User[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeamJudges = useCallback(async () => {
    try {
      const teamRes = await getManyTeams({ tableNumber });

      if (!teamRes.ok || (teamRes.body && teamRes.body.length !== 1)) {
        throw new Error(teamRes.error ?? 'No team found');
      }

      const rawTeam = teamRes.body[0];
      const team_id = rawTeam._id;

      const submissionsRes = await getManySubmissions({
        team_id: {
          '*convertId': {
            id: team_id,
          },
        },
      });

      if (!submissionsRes.ok) {
        throw new Error(submissionsRes.error ?? 'No submissions found');
      }

      const submissions = submissionsRes.body;

      const judge_ids = submissions.map((sub: Submission) => sub.judge_id);

      const judgesRes = await getManyUsers({
        _id: {
          $in: {
            '*convertIds': {
              ids: judge_ids,
            },
          },
        },
      });

      if (!judgesRes.ok) {
        throw new Error(judgesRes.error ?? 'No judges found');
      }

      const submissionMap = Object.fromEntries(
        submissions.map((sub: Submission) => [sub.judge_id, sub])
      );

      const rawJudges = judgesRes.body ?? [];
      const judgeData = rawJudges
        .map((judge: User) => ({
          ...judge,
          queuePosition: submissionMap[judge._id ?? ''].queuePosition,
          isScored: submissionMap[judge._id ?? ''].is_scored,
        }))
        .sort((a: HydratedJudge, b: HydratedJudge) => {
          if (!a.isScored && b.isScored) return -1;
          else if (!b.isScored && a.isScored) return 1;
          return a.queuePosition - b.queuePosition;
        });

      setJudges(judgeData);
      setTeam(rawTeam);
      setError(null);
      setLoading(false);
    } catch (e) {
      const error = e as HttpError;
      setJudges(null);
      setTeam(null);
      setError(error.message);
      setLoading(false);
    }
  }, [tableNumber]);

  useEffect(() => {
    fetchTeamJudges();
  }, [fetchTeamJudges]);

  return {
    team,
    judges,
    loading,
    error,
    fetchTeamJudges,
  };
}
