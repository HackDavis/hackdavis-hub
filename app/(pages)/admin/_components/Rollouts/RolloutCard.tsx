'use client';

import styles from './RolloutCard.module.scss';
import Rollout from '@typeDefs/rollout';

import { FaRegEdit } from 'react-icons/fa';
import { IoTrashOutline } from 'react-icons/io5';

interface RolloutCardProps {
  rollout: Rollout;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
  editable?: boolean;
}

export default function RolloutCard({
  rollout,
  onEditClick = () => {},
  onDeleteClick = () => {},
  editable = true,
}: RolloutCardProps) {
  const rolloutDate = new Date(rollout.rollout_time);
  const rollbackDate = rollout.rollback_time
    ? new Date(rollout.rollback_time)
    : null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <span className={styles.title}>{rollout.component_key}</span>
        </div>
        <div className={styles.header_details}>
          {editable && (
            <div className={styles.actions}>
              <button className={styles.edit_button} onClick={onEditClick}>
                <FaRegEdit />
              </button>
              <button className={styles.delete_button} onClick={onDeleteClick}>
                <IoTrashOutline />
              </button>
            </div>
          )}
          <p>{rollout._id}</p>
        </div>
      </div>
      <hr></hr>
      <div className={styles.details}>
        <p>
          Rollout Time: {rolloutDate.toLocaleDateString()},{' '}
          {rolloutDate.toLocaleTimeString()}
        </p>
        {rollbackDate && (
          <p>
            Rollback Time: {rollbackDate.toLocaleDateString()},{' '}
            {rollbackDate.toLocaleTimeString()}
          </p>
        )}
      </div>
    </div>
  );
}
