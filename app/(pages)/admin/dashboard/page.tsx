'use client';
import JudgingProgress from '../_components/JudgingProgress/JudgingProgress';
import styles from './page.module.scss';

export default function Dashboard() {
  return (
    <div className={styles.page_container}>
      <h1 className={styles.page_title}>Dashboard</h1>
      <div className={styles.dashboard_container}>
        <div className={styles.overview_container}>
          <h2>Overview</h2>
          <div className={styles.scoring_progress_container}>
            <JudgingProgress />
          </div>
        </div>
        <div className={styles.divider} />
        <div className={styles.problems_container}>
          <h2>Problems</h2>
        </div>
      </div>
    </div>
  );
}
