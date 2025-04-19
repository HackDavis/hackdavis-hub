'use client';

import HubHero from './HubHero';
import TableLocations from './TableLocations';
import ViewProjects from './ViewProjects';
import styles from './JudgingHub.module.scss';
import Waiting from './Waiting';
// import ViewMap from './ViewMap';
// import Dismiss from './Dismiss';

export default function JudgingHub() {
  return (
    <div className={styles.container}>
<<<<<<< HEAD
      {/* <ViewProjects /> */}
=======
      <ViewProjects />
      {/* <ViewMap/>
      <Dismiss/> */}
>>>>>>> feat/announcements
      <HubHero />
      <Waiting />
      <TableLocations />
    </div>
  );
}
