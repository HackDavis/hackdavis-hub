'use client';

import { useEffect, useState } from 'react';
import JudgeBannerIndividual from './JudgeBannerIndividual';
import Team from '@typeDefs/team';
import User from '@typeDefs/user';
import { getManyTeams } from '@actions/teams/getTeams';
import styles from './JudgeBannerIndividual.module.scss';
import Submission from '@typeDefs/submission';
import DoneJudging from './DoneJudging';
import useTableNumberContext from '@pages/_hooks/useTableNumberContext';

const icons = [
  '/hackers/hero/PeekingCow.svg',
  '/hackers/hero/PeekingBunny.svg',
  '/hackers/hero/PeekingDuck.svg',
  '/hackers/hero/PeekingCow.svg',
  '/hackers/hero/PeekingBunny.svg',
  '/hackers/hero/PeekingDuck.svg',
];

interface TeamExpanded extends Team {
  judges: User[];
  submissions: Submission[];
}

export default function JudgeBanners() {
  const [judges, setJudges] = useState<User[] | null>(null);
  const [submissions, setSubmissions] = useState<Submission[] | null>(null);
  const { loading, storedValue: tableNumber } = useTableNumberContext();
  useEffect(() => {
    const fetchJudges = async () => {
      try {
        const teamRes = await getManyTeams({ tableNumber });

        if (!teamRes.ok || !teamRes.body || teamRes.body.length !== 1) {
          throw new Error(
            teamRes.error ?? `Error getting team with ${tableNumber}`
          );
        }

        const team: TeamExpanded = teamRes.body[0];
        setJudges(team.judges);
        setSubmissions(team.submissions);
      } catch (e) {
        const error = e as Error;
        return {
          ok: false,
          error: error.message,
        };
      }
    };

    if (tableNumber) {
      fetchJudges();
    }

    const pollingInterval = setInterval(() => {
      if (tableNumber) {
        fetchJudges();
      }
    }, 60 * 1000);

    return () => clearInterval(pollingInterval);
  }, [tableNumber]);

  if (submissions) {
    const allScored = submissions.every((sub: Submission) => sub.is_scored);
    if (allScored) {
      return <DoneJudging />;
    }
  }

  if (loading) {
    return null;
  }

  return (
    <div className={styles.container_position}>
      {judges &&
        judges
          .sort((a: User, b: User) => {
            const aSubmission = submissions?.find(
              (submission) => submission.judge_id === a._id
            );
            const bSubmission = submissions?.find(
              (submission) => submission.judge_id === b._id
            );

            const aScored = aSubmission?.is_scored ?? false;
            const bScored = bSubmission?.is_scored ?? false;
            if (!aScored && bScored) return -1;
            else if (!bScored && aScored) return 1;
            else if (aScored && bScored) return 0;

            const aQueuePosition = aSubmission?.queuePosition ?? 0;
            const bQueuePosition = bSubmission?.queuePosition ?? 0;
            return aQueuePosition - bQueuePosition;
          })
          .map((judge, index) => (
            <JudgeBannerIndividual
              key={judge._id}
              icon={icons[index]}
              name={judge.name}
              teamsAhead={
                submissions?.find(
                  (submission) => submission.judge_id === judge._id
                )?.queuePosition ?? 0
              }
              completed={
                submissions?.find(
                  (submission) => submission.judge_id === judge._id
                )?.is_scored ?? false
              }
            />
          ))}
    </div>
  );
}
