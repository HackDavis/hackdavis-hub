'use client';

import Team from '@typeDefs/team';
import styles from './JudgeCard.module.scss';
import { FaRegEdit } from 'react-icons/fa';
import { IoIosCheckmarkCircle, IoIosCloseCircle } from 'react-icons/io';

import User from '@typeDefs/user';

interface JudgeWithTeams extends User {
  teams: Team[];
}

interface TeamCardProps {
  judge: JudgeWithTeams;
  onEditClick?: () => void;
  editable?: boolean;
}

export default function JudgeCard({
  judge,
  onEditClick = () => {},
  editable = true,
}: TeamCardProps) {
  const specialties = judge.specialties ?? [];
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <span className={styles.title}>
            {judge.name}
            {judge.has_checked_in ? (
              <IoIosCheckmarkCircle className={styles.checked_in_icon} />
            ) : (
              <IoIosCloseCircle className={styles.not_checked_in_icon} />
            )}
          </span>
          <p className={styles.email}>{judge.email}</p>
        </div>
        <div className={styles.header_details}>
          {editable && (
            <button className={styles.edit_button} onClick={onEditClick}>
              <FaRegEdit />
            </button>
          )}
          <p>{judge._id}</p>
        </div>
      </div>
      <hr></hr>
      <div className={styles.details}>
        <div className={styles.specialties_container}>
          {specialties.map((specialty: string) => (
            <div key={specialty} className={styles.specialty}>
              {specialty}
            </div>
          ))}
        </div>
        <div className={styles.teams_container}>
          {judge.teams.map((team: Team) => (
            <div key={team._id} className={styles.team}>
              {team.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
