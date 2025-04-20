'use client';

import { useState, useEffect, useCallback } from 'react';

import { getManySubmissions } from '@actions/submissions/getSubmission';
import { getManyTeams } from '@actions/teams/getTeams';
import Submission from '@typeDefs/submission';
import Team from '@typeDefs/team';
import { HttpError } from '@utils/response/Errors';

export function useJudgeSubmissions(judge_id: string) {
  const [loading, setLoading] = useState<boolean>(true);
  const [submissions, setSubmissions] = useState<any>(null);
  const [teams, setTeams] = useState<any>(null);
  const [scoredTeams, setScoredTeams] = useState<any>(null);
  const [unscoredTeams, setUnscoredTeams] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const updateSubmissions = useCallback(async (judge_id: string) => {
    try {
      const submissionsRes = await getManySubmissions({
        judge_id: {
          '*convertId': {
            id: judge_id,
          },
        },
      });

      if (!submissionsRes.ok) {
        throw new Error(submissionsRes.error ?? '');
      }

      const sortedSubs = (submissionsRes.body ?? []).sort(
        (a: Submission, b: Submission) =>
          (a.queuePosition ?? 0) - (b.queuePosition ?? 0)
      );

      const team_ids = sortedSubs.map((sub: Submission) => sub.team_id);

      const teamsRes = await getManyTeams({
        _id: {
          $in: {
            '*convertIds': {
              ids: team_ids,
            },
          },
        },
      });

      if (!teamsRes.ok) {
        throw new Error(teamsRes.error ?? '');
      }

      const rawTeams = teamsRes.body ?? [];
      const activeTeams = rawTeams.filter((team: Team) => team.active);
      const teamsMap = Object.fromEntries(
        activeTeams.map((team: Team) => [team._id, team])
      );

      const sortedTeams = sortedSubs
        .map((sub: Submission) => {
          if (teamsMap[sub.team_id]) {
            return {
              ...teamsMap[sub.team_id],
              queuePosition: sub.queuePosition,
            };
          }
          return null;
        })
        .filter(Boolean);

      const scoredSubs = sortedSubs.filter(
        (sub: Submission) => sub.is_scored && teamsMap[sub.team_id]
      );

      const unscoredSubs = sortedSubs.filter(
        (sub: Submission) => !sub.is_scored && teamsMap[sub.team_id]
      );

      const scoredTeams = scoredSubs.map((sub: Submission) => ({
        ...teamsMap[sub.team_id],
        queuePosition: sub.queuePosition,
      }));

      const unscoredTeams = unscoredSubs.map((sub: Submission) => ({
        ...teamsMap[sub.team_id],
        queuePosition: sub.queuePosition,
      }));

      setSubmissions(sortedSubs);
      setTeams(sortedTeams);
      setUnscoredTeams(unscoredTeams);
      setScoredTeams(scoredTeams);
      setError(null);
      setLoading(false);
    } catch (e) {
      const error = e as HttpError;
      setSubmissions(null);
      setTeams(null);
      setUnscoredTeams(null);
      setScoredTeams(null);
      setError(error.message);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    updateSubmissions(judge_id);
  }, [judge_id, updateSubmissions]);

  return {
    submissions,
    teams,
    scoredTeams,
    unscoredTeams,
    loading,
    error,
    updateSubmissions,
  };
}
