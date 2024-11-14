import HubHero from './HubHero';
import TableLocations from './TableLocations';
import ViewProjects from './ViewProjects';
import styles from './JudgingHub.module.scss';
import Waiting from './Waiting';
import { useJudgeGroup } from '@hooks/useJudgeGroup';

export default async function JudgingHub() {
  return (
    <div className={styles.container}>
      <ViewProjects />
      <HubHero user={user} loading={loading} members={members} />
      <Waiting />
      {/* <JudgingList projects={unjudgedTeams} /> */}
      <TableLocations />
    </div>
  );
}
