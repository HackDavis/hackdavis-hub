import { useAuth } from '@hooks/useAuth';
import styles from './JudgingHub.module.scss';
import HubHero from './HubHero';
import TableLocations from './TableLocations';
import ViewProjects from './ViewProjects';
import { useJudgeGroup } from '@hooks/useJudgeGroup';

export default function JudgingHub() {
  const { user, loading } = useAuth();
  const { members } = useJudgeGroup();
  return (
    <div className={styles.container}>
      <ViewProjects />
      <HubHero user={user} loading={loading} members={members} />
      {/* <JudgingList projects={unjudgedTeams} /> */}
      <TableLocations />
    </div>
  );
}
