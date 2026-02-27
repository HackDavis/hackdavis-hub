'use client';
import styles from './page.module.scss';

import Link from 'next/link';
import JudgingProgress from './_components/JudgingProgress/JudgingProgress';

const action_links = [
  {
    href: '/admin/csv',
    body: 'Import Teams with CSV',
  },
  {
    href: '/admin/match',
    body: 'Assign Judges to Teams',
  },
  {
    href: '/admin/score',
    body: 'Score and Shortlist',
  },
  {
    href: '/admin/panels',
    body: 'Create Panels',
  },
  {
    href: '/admin/invite-link',
    body: 'Invite Judges',
  },
  {
    href: '/admin/randomize-projects',
    body: 'Randomize Projects',
  },
  {
    href: '/admin/announcements',
    body: 'Announcements',
  },
  {
    href: '/admin/hackbot',
    body: 'HackBot Knowledge',
  },
];

const data_links = [
  {
    href: '/admin/teams',
    body: 'View Teams',
  },
  {
    href: '/admin/judges',
    body: 'View Judges',
  },
  {
    href: '/admin/rollouts',
    body: 'View Rollouts',
  },
];

export default function Dashboard() {
  return (
    <div className={styles.page_container}>
      <div className={styles.dashboard_container}>
        <div className={styles.overview_container}>
          <div className={styles.navigation}>
            <h2>Navigation</h2>
            <div className={styles.navigation_flex}>
              <div className={styles.action_links}>
                {action_links.map(({ href, body }) => (
                  <Link
                    key={JSON.stringify({ href, body })}
                    href={href}
                    className={styles.action_link}
                  >
                    {body}
                  </Link>
                ))}
              </div>
              <div className={styles.data_links}>
                {data_links.map(({ href, body }) => (
                  <Link
                    key={JSON.stringify({ href, body })}
                    href={href}
                    className={styles.data_link}
                  >
                    {body}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <hr></hr>
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
