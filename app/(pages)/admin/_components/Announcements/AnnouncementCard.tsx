'use client';

import Announcement from '@typeDefs/announcement';
import { FaRegEdit } from 'react-icons/fa';
import styles from './AnnouncementCard.module.scss';

interface AnnouncementCardProps {
  announcement: Announcement;
  onEditClick?: () => void;
  editable?: boolean;
}

export default function AnnouncementCard({
  announcement,
  onEditClick = () => {},
  editable = true,
}: AnnouncementCardProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>
          {announcement.title} -
          <p>{new Date(announcement.time).toLocaleTimeString()}</p>
        </span>
        <div className={styles.header_details}>
          {editable && (
            <button className={styles.edit_button} onClick={onEditClick}>
              <FaRegEdit />
            </button>
          )}
          <p>{announcement._id}</p>
        </div>
      </div>
      <hr></hr>
      <div className={styles.details}>
        <p>{announcement.description}</p>
      </div>
    </div>
  );
}
