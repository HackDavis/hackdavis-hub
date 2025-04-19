'use client';

import { useState } from 'react';
import { useAnnouncements } from '@pages/_hooks/useAnnouncements';
import { GoSearch } from 'react-icons/go';
import Announcement from '@typeDefs/announcement';
import AnnouncementCard from '../_components/Announcements/AnnouncementCard';
import AnnouncementForm from '../_components/Announcements/AnnouncementForm';
import useFormContext from '../_hooks/useFormContext';
import styles from './page.module.scss';

export default function Announcements() {
  const [search, setSearch] = useState('');
  const { loading, announcements, getAnnouncements } = useAnnouncements();
  const { data, setData } = useFormContext();
  const isEditing = Boolean(data._id);

  if (loading) {
    return 'loading...';
  }

  if (!announcements.ok) {
    return announcements.error;
  }

  const announcementData: Announcement[] = announcements.body
    .filter((announcement: Announcement) =>
      JSON.stringify(announcement).toLowerCase().includes(search.toLowerCase())
    )
    .sort((a: Announcement, b: Announcement) => {
      const dateA = new Date(a.time);
      const dateB = new Date(b.time);
      return dateA.getTime() - dateB.getTime();
    });

  return (
    <div className={styles.container}>
      <h1 className={styles.page_title}>Announcement Manager</h1>
      <h2 className={styles.action_header}>
        {isEditing ? 'Edit' : 'Create'} Announcement
      </h2>
      <AnnouncementForm
        cancelAction={() => setData({})}
        revalidate={getAnnouncements}
      />
      <hr />
      <h2 className={styles.action_header}>View Anouncements</h2>
      <div className={styles.search_bar}>
        <input
          name="search"
          type="text"
          value={search}
          placeholder="Filter announcements"
          onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
        />
        <GoSearch className={styles.search_icon} />
      </div>
      <div className={styles.data_portion}>
        <div className={styles.announcements_list}>
          {announcementData.map((announcement: Announcement) => (
            <div
              className={styles.announcement_card_wrapper}
              key={announcement._id}
            >
              <AnnouncementCard
                announcement={announcement}
                onEditClick={() => setData(announcement)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
