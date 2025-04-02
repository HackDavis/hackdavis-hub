import styles from './ImportantAnnouncement.module.scss';
import Image from 'next/image';
import ImportantAnnouncementImage from '@public/hackers/project-info/ImportantAnnouncement.svg';
import BlueHammer from '@public/hackers/project-info/BlueHammer.svg';
import GreenHammer from '@public/hackers/project-info/GreenHammer.svg';

export default function ImportantAnnouncement() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.child1}>
          <Image
            className={styles.ImportantAnnouncementImage}
            src={ImportantAnnouncementImage}
            alt="Two animals at a judging table"
          />
        </div>
        <div className={styles.child2}>
          <div className={styles.text1}>
            <div className={styles.bulletItem}>
              <Image
                className={styles.hammer}
                src={GreenHammer}
                alt="Two animals at a judging table"
              />
              <p>Team numbers will be available on Devpost</p>
            </div>
            <div className={styles.bulletItem}>
              <Image
                className={styles.hammer}
                src={GreenHammer}
                alt="Two animals at a judging table"
              />
              <p>
                Each team member MUST input their team number on{' '}
                <b>HackerHub</b>
              </p>
            </div>
          </div>
          <div className={styles.text2}>
            <div className={styles.bulletItem}>
              <Image
                className={styles.hammer}
                src={BlueHammer}
                alt="Two animals at a judging table"
              />
              <p>
                HackerHub will provide you with a table number (NOT the same as
                your team number)
              </p>
            </div>
            <div className={styles.bulletItem}>
              <Image
                className={styles.hammer}
                src={BlueHammer}
                alt="Two animals at a judging table"
              />
              <p>
                Use this table number (NOT your team number) to find your table
                for demos
              </p>
            </div>
            <div className={styles.bulletItem}>
              <Image
                className={styles.hammer}
                src={BlueHammer}
                alt="Two animals at a judging table"
              />
              <p>
                Contact a HackDavis director if you and your team are not seeing
                the same table number
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
