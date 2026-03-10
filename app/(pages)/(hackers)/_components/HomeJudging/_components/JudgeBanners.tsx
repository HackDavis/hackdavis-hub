'use client';

import { useEffect } from 'react';
import JudgeBannerIndividual from './JudgeBannerIndividual';
import User from '@typeDefs/user';
import styles from './JudgeBannerIndividual.module.scss';
import useTableNumberContext from '@pages/_hooks/useTableNumberContext';
import { useTeamJudgesFromTableNumber } from '@pages/_hooks/useTeamJudgesFromTableNumber';
import { nonHDTracks } from '@data/tracks';

const icons = [
  '/hackers/hero/PeekingCow.svg',
  '/hackers/hero/PeekingBunny.svg',
  '/hackers/hero/PeekingDuck.svg',
  '/hackers/hero/PeekingCow.svg',
  '/hackers/hero/PeekingBunny.svg',
  '/hackers/hero/PeekingDuck.svg',
];

interface HydratedJudge extends User {
  queuePosition: number;
  isScored: boolean;
}

export default function JudgeBanners({
  onAllScored,
}: {
  onAllScored: () => void;
}) {
  const { storedValue: tableNumber } = useTableNumberContext();
  const { team, judges, loading, error, fetchTeamJudges } =
    useTeamJudgesFromTableNumber(tableNumber ?? -1);
  const allScored = judges?.every((judge: HydratedJudge) => judge.isScored);

  useEffect(() => {
    if (allScored) {
      onAllScored();
    }
  }, [allScored, onAllScored]);

  useEffect(() => {
    if (tableNumber) {
      fetchTeamJudges();
    }

    const pollingInterval = setInterval(() => {
      if (tableNumber) {
        fetchTeamJudges();
      }
    }, 60 * 1000);

    return () => clearInterval(pollingInterval);
  }, [fetchTeamJudges, tableNumber]);

  if (loading || error !== null) {
    return error;
  }

  if (!tableNumber || judges.length === 0) {
    return null;
  }

  const effectiveJudges = judges as HydratedJudge[];

  const teamNonHDCategories: string[] = ((team as any)?.tracks ?? [])
    .filter((track: string) => track in nonHDTracks)
    .map((track: string) => nonHDTracks[track].filter);
  const hasNonprofitTrack = teamNonHDCategories.includes('Non-Profit');
  const hasSponsorTrack = teamNonHDCategories.includes('Sponsor');
  const hasMLHTrack = teamNonHDCategories.includes('MLH');

  return (
    <div className={styles.container_position}>
      {hasNonprofitTrack && (
        <JudgeBannerIndividual
          icon="/hackers/hero/PeekingCow.svg"
          name="NPO Judge"
          description="Since you submitted for an NPO track, you will also be visited by an NPO representative."
          completed={false}
        />
      )}
      {hasSponsorTrack && (
        <JudgeBannerIndividual
          icon="/hackers/hero/PeekingBunny.svg"
          name="Sponsor Judge"
          description="Since you submitted for a sponsor track, you will also be visited by a sponsor representative."
          completed={false}
        />
      )}
      {hasMLHTrack && (
        <JudgeBannerIndividual
          icon="/hackers/hero/PeekingDuck.svg"
          name="MLH Judge"
          description="Since you submitted for an MLH track, you will also be visited by an MLH representative."
          completed={false}
        />
      )}
      {effectiveJudges.map((judge: HydratedJudge, index: number) => (
        <JudgeBannerIndividual
          key={judge._id}
          icon={icons[index]}
          name={judge.name}
          teamsAhead={judge.queuePosition}
          completed={judge.isScored}
        />
      ))}
    </div>
  );
}
