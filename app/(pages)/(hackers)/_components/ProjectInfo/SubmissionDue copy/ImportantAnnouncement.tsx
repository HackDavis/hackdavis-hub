import styles from './ImportantAnnouncement.module.scss';
import Image from 'next/image';
import ImportantAnnouncementImage from '@public/hackers/project-info/ImportantAnnouncement.svg';

export default function ImportantAnnouncement() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.child}>
          <Image
            className={styles.step2}
            src={ImportantAnnouncementImage}
            alt="Two animals at a judging table"
          />
        </div>
        <Image
          className={styles.step2}
          src={ImportantAnnouncementImage}
          alt="Two animals at a judging table"
        />
      </div>
    </>
  );
}
