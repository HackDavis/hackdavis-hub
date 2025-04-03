'use client';

import Team from '@typeDefs/team';
import styles from './TeamCard.module.scss';
import TrackList from './TrackList';
import { IoLocationOutline } from 'react-icons/io5';
import JudgeList from './JudgeList';
import User from '@typeDefs/user';

interface TeamWithJudges extends Team {
  judges: User[];
}
interface TeamCardProps {
  team: TeamWithJudges;
}

export default function TeamCard({ team }: TeamCardProps) {
  return (
    <div className={styles.container}>
      <span className={styles.title}>
        <p className={styles.table_number}>
          <IoLocationOutline style={{ fontSize: '1.2rem' }} />{' '}
          {team.tableNumber}
        </p>
        Team {team.teamNumber}: {team.name}
      </span>
      <hr></hr>
      {/* <p>{team._id}</p> */}
      <div className={styles.details}>
        <TrackList team={team} />
        <p
          className={`${styles.active_indicator} ${
            team.active ? styles.active : null
          }`}
        >
          {team.active ? 'Active' : 'Inactive'}
        </p>
        <JudgeList judges={team.judges} />
      </div>
    </div>
  );
}
