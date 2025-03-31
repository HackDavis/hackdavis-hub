'use client';

import { useState } from 'react';
import styles from './page.module.scss';
import ScoringForm from '@components/ScoringForm/ScoringForm';
import Image from 'next/image';
import Link from 'next/link';

import { useSubmission } from '@hooks/useSubmission';
import { useTeam } from '@hooks/useTeam';

import leftArrow from '@public/judges/scoring/left-arrow.svg';

interface ScoringFormProps {
  params: {
    'team-id': string;
  };
}

export default function ScoreTeam({ params }: ScoringFormProps) {
  const [showInfo, setShowInfo] = useState(false);
  const { submission, loading: subLoading } = useSubmission(params['team-id']);
  const { team, loading: teamLoading } = useTeam(params['team-id']);
  const loading = subLoading || teamLoading;

  if (loading) {
    return 'loading...';
  }

  if (!submission.ok) {
    return submission.error;
  }

  if (!team.ok) {
    return team.error;
  }

  return (
    <div className={styles.container}>
      <Link className={styles.back_button} href="/judges/projects">
        <Image src={leftArrow} alt="left arrow" />
        Back to projects
      </Link>
      <h1 className={styles.project_label}>Table {team.body.teamNumber}</h1>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${showInfo ? styles.active : null}`}
          onClick={() => setShowInfo(true)}
        >
          Information
        </button>
        <button
          className={`${styles.tab} ${!showInfo ? styles.active : null}`}
          onClick={() => setShowInfo(false)}
        >
          Scoring
        </button>
      </div>
      <div style={{ display: showInfo ? 'none' : 'block' }}>
        <ScoringForm submission={submission.body} team={team.body} />
      </div>
      <div
        className={`${styles.info_container} ${showInfo ? styles.show : null}`}
      >
        <p>Judging categories Table {team.body.teamNumber} signed up for:</p>
        {team.body.tracks.map((category: string) => (
          <p key={category} className={styles.category_card}>
            {category}
          </p>
        ))}
      </div>
    </div>
  );
}
