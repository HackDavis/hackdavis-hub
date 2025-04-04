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
  const backgroundColor = team.active ? 'white' : '#ffc6bf';
  return (
    <div className={styles.container} style={{ backgroundColor }}>
      <div className={styles.header}>
        <span className={styles.title}>
          <p className={styles.table_number}>
            <IoLocationOutline style={{ fontSize: '1.2rem' }} />{' '}
            {team.tableNumber}
          </p>
          Team {team.teamNumber}: {team.name}
        </span>
        <div className={styles.header_details}>
          <p>{team._id}</p>
        </div>
      </div>
      <hr></hr>
      <div className={styles.details}>
        <TrackList team={team} />
        <JudgeList judges={team.judges} />
      </div>
    </div>
  );
}
