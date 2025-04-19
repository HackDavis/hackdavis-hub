'use client';

import Announcement from '@typeDefs/announcement';
import styles from './AnnouncementItem.module.scss';

interface AnnouncementProps {
  announcement: Announcement;
  isNew: boolean;
}

const formatTime = (date: Date): string => {
  const pstDate = new Date(
    date.toLocaleString('en-US', {
      timeZone: 'America/Los_Angeles',
    })
  );

  return pstDate.toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export default function AnnouncementItem({
  announcement,
  isNew,
}: AnnouncementProps) {
  return (
    <div className={styles.announcement}>
      <div className={styles.time_and_icon}>
        <p style={{ color: '#848484' }}>{formatTime(announcement.time)}</p>
        {isNew && <div className={styles.circle} />}
      </div>
      <h6 style={{ fontWeight: '500' }}>{announcement.title}</h6>
      <p>{announcement.description}</p>
    </div>
  );
}
