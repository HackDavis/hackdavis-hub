'use client';
import Image from 'next/image';

import styles from './JudgingProgress.module.scss';
import duck from '/public/hackers/flag_duck.svg';

import { useSubmissions } from '@pages/_hooks/useSubmissions';
import Submission from '@typeDefs/submission';

export default function JudgingProgress() {
  const { loading: submissionsLoading, submissions: submissionsRes } =
    useSubmissions();

  const loading = submissionsLoading;

  if (loading) return 'loading...';
  if (!submissionsRes.ok) return submissionsRes.error;

  const submissions: Submission[] = submissionsRes.body;

  const numSubmissions = submissions.length;
  const numScored = submissions.filter((sub) => sub.is_scored).length;
  const progressPercentage = Math.round((100 * numScored) / numSubmissions);

  return (
    <div className={styles.container}>
      <p>
        Our HD judges have submitted {numScored} out of {numSubmissions}{' '}
        submissions.
      </p>
      <div className={styles.progress_container}>
        <div className={styles.flag_duck}>
          <div className={styles.flag}>
            <div className={styles.fabric}>
              <p className={styles.percentage}>{progressPercentage}% done!</p>
            </div>
            <div className={styles.pole} />
          </div>
          <Image src={duck} alt="Duck holding flag!" />
        </div>
        <div className={styles.progress_box}>
          <div className={styles.progress_num_container}>
            <p
              className={styles.progress_num}
              style={{ left: `${progressPercentage}%` }}
            >
              {numScored}
            </p>
          </div>
          <div className={styles.bar_holder}>
            <div
              className={styles.bar}
              style={{ right: `${100 - progressPercentage}%` }}
            />
          </div>
          <div className={styles.scale_nums}>
            <p>0</p>
            <p>{numSubmissions}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
