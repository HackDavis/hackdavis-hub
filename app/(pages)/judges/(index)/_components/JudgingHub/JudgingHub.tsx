'use client';

import HubHero from './HubHero';
import TableLocations from './TableLocations';
import ViewProjects from './ViewProjects';
import styles from './JudgingHub.module.scss';
import Waiting from './Waiting';

export default function JudgingHub() {
  const { user, loading } = useAuth();
  return (
    <div className={styles.container}>
      <ViewProjects />
      <HubHero user={user} loading={loading} />
      <Waiting />
      {/* <JudgingList projects={unjudgedTeams} /> */}
      <TableLocations />
    </div>
  );
}
