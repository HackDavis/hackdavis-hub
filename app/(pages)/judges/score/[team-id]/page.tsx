'use client';

import { useState } from 'react';
// import { useSession } from 'next-auth/react';
import styles from './page.module.scss';
import ScoringForm from '@app/(pages)/_components/ScoringForm/ScoringForm';

interface ScoringFormProps {
  params: {
    'team-id': string;
  };
}

const judgingCategories = [
  'Best Usage of MongoDB',
  'Best Social Hack',
  'Best Beginner Hack',
  'Best Design',
];

export default function ScoreTeam({ params }: ScoringFormProps) {
  // const { data } = useSession();
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className={styles.container}>
      <button>{`< Back to Projects`}</button>
      <h1>Table {params['team-id']}</h1>
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
        <ScoringForm submission_id="12345" />
      </div>
      <div style={{ display: showInfo ? 'block' : 'none' }}>
        <p>Judging categories Table {params['team-id']} signed up for:</p>
        <div className={styles.category_cards}>
          {judgingCategories.map((category) => (
            <p key={category} className={styles.category_card}>
              {category}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
