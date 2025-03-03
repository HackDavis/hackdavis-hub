'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import styles from './page.module.scss';
import ScoringForm from '@components/ScoringForm/ScoringForm';
import Image from 'next/image';
import Link from 'next/link';

import leftArrow from '@public/judges/scoring/left-arrow.svg';

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
  const { data } = useSession();
  console.log(data?.user);
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className={styles.container}>
      <Link className={styles.back_button} href="/judges">
        <Image src={leftArrow} alt="left arrow" />
        Back to projects
      </Link>
      <h1 className={styles.project_label}>Table {params['team-id']}</h1>
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
      <div
        className={`${styles.info_container} ${showInfo ? styles.show : null}`}
      >
        <p>Judging categories Table {params['team-id']} signed up for:</p>
        {judgingCategories.map((category) => (
          <p key={category} className={styles.category_card}>
            {category}
          </p>
        ))}
      </div>
    </div>
  );
}
