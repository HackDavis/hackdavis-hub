'use client';

import Team from '@typeDefs/team';
import styles from './TeamCard.module.scss';
import TrackList from './TrackList';
import { IoLocationOutline } from 'react-icons/io5';
import { FaRegEdit } from 'react-icons/fa';
import JudgeList from './JudgeList';
import User from '@typeDefs/user';
import { IoIosCheckmarkCircle, IoIosCloseCircle } from 'react-icons/io';

interface TeamWithJudges extends Team {
  judges: User[];
}
interface TeamCardProps {
  team: TeamWithJudges;
  onEditClick?: () => void;
  editable?: boolean;
}

export default function TeamCard({
  team,
  onEditClick = () => {},
  editable = true,
}: TeamCardProps) {
  const reports = team.reports ?? [];
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>
          <p className={styles.table_number}>
            <IoLocationOutline style={{ fontSize: '1.2rem' }} />{' '}
            {team.tableNumber}
          </p>
          Team {team.teamNumber}: {team.name}
          {team.active ? (
            <IoIosCheckmarkCircle className={styles.active_icon} />
          ) : (
            <IoIosCloseCircle className={styles.inactive_icon} />
          )}
        </span>
        <div className={styles.header_details}>
          {editable && (
            <button className={styles.edit_button} onClick={onEditClick}>
              <FaRegEdit />
            </button>
          )}
          <p>{team._id}</p>
        </div>
      </div>
      <hr></hr>
      <div className={styles.details}>
        <TrackList team={team} />
        {team?.judges && <JudgeList judges={team.judges} />}
        <div className={styles.reports_container}>
          {reports.map(({ timestamp, judge_id }) => (
            <div
              key={JSON.stringify({ timestamp, judge_id })}
              className={styles.report_container}
            >
              <p>{judge_id}</p>
              <p>{new Date(timestamp).toLocaleTimeString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
