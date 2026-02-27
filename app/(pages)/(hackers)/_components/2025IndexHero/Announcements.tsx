'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAnnouncements } from '@pages/_hooks/useAnnouncements';
import AnnouncementItem from './AnnouncementItem';
import Loader from '@pages/_components/Loader/Loader';
import Announcement from '@typeDefs/announcement';
import star_icon from '@public/hackers/hero/star.svg';
import cow_tada from '@public/hackers/hero/cow_tada.svg';
import styles from './Announcements.module.scss';

export default function Announcements() {
  const { loading, announcements, getAnnouncements } = useAnnouncements();
  const [seenAnnouncements, setSeenAnnouncements] = useState(new Set());

  useEffect(() => {
    const storedAnnouncements = localStorage.getItem('seenAnnouncementIds');
    if (storedAnnouncements) {
      setSeenAnnouncements(new Set(JSON.parse(storedAnnouncements)));
    }
  }, []);

  useEffect(() => {
    if (!loading && announcements.ok && announcements.body.length > 0) {
      const announcementIds = announcements.body.map(
        (announcement: Announcement) => announcement._id
      );

      localStorage.setItem(
        'seenAnnouncementIds',
        JSON.stringify(announcementIds)
      );
    }
  }, [loading, announcements]);

  useEffect(() => {
    const pollingInterval = setInterval(
      () => {
        getAnnouncements();
      },
      15 * 60 * 1000
    ); // poll every 15 minutes

    return () => clearInterval(pollingInterval);
  }, [getAnnouncements]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.heading}>
          <h2>ANNOUNCEMENTS</h2>
          <Image src={star_icon} alt="star icon" className={styles.star_icon} />
        </div>
        <div className={styles.announcements}>
          <div className={styles.loader}>
            <Loader modal={true} />
          </div>
        </div>
      </div>
    );
  }

  if (!announcements.ok) {
    return announcements.error;
  }

  const announcementData: Announcement[] = announcements.body.sort(
    (a: Announcement, b: Announcement) => {
      const dateA = new Date(a.time);
      const dateB = new Date(b.time);
      return dateB.getTime() - dateA.getTime();
    }
  );

  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <h2>ANNOUNCEMENTS</h2>
        <Image src={star_icon} alt="star icon" className={styles.star_icon} />
      </div>
      <div className={styles.announcements}>
        {announcementData.length === 0 ? (
          <div className={styles.empty}>
            <Image src={cow_tada} alt="cow tada" className={styles.cow_img} />
            <p>NO ANNOUNCEMENTS YET, HAPPY HACKING!</p>
          </div>
        ) : (
          announcementData.map((announcement: Announcement) => (
            <AnnouncementItem
              key={announcement._id}
              announcement={announcement}
              isNew={!seenAnnouncements.has(announcement._id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
