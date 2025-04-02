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
        <div className={styles.child}>
          <div className={styles.text1}>
            <p>Team numbers will be available on Devpost</p>
            <p>
              Each team member MUST input their team number on <b>HackerHub</b>
            </p>
          </div>
          <div className={styles.text2}>
            <p>
              HackerHub will provide you with a <b>table number</b> (NOT the
              same as your team number)
            </p>
            <p>
              Each team member MUST input their team number on <b>HackerHub</b>
            </p>
            <p>
              Use this table number (NOT your team number) to find your table
              for demos
            </p>
            <p>
              Contact a HackDavis director if you and your team are not seeing
              the same table number
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
