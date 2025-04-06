'use client';

import Team from '@typeDefs/team';
import styles from './JudgeCard.module.scss';
import { FaRegEdit } from 'react-icons/fa';
import User from '@typeDefs/user';

interface JudgeWithTeams extends User {
  teams: Team[];
}

interface TeamCardProps {
  judge: JudgeWithTeams;
  onEditClick?: () => void;
}

export default function JudgeCard({
  judge,
  onEditClick = () => {},
}: TeamCardProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>{judge.name}</span>
        <div className={styles.header_details}>
          <button className={styles.edit_button} onClick={onEditClick}>
            <FaRegEdit />
          </button>
          <p>{judge._id}</p>
        </div>
      </div>
      <hr></hr>
      <div className={styles.details}></div>
    </div>
  );
}
