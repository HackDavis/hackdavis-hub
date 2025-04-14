import styles from './Contact.module.scss';
import Image from 'next/image';
import Squiggle from 'public/hackers/hero/SquiggleBorder.svg';
import CowPhone from 'public/hackers/hero/CowPhone.svg';
import Cow from 'public/hackers/hero/AirpodCow.svg';
import DuckPhone from 'public/hackers/hero/DuckPhone.svg';
import Duck from 'public/hackers/hero/AirpodDuck.svg';

export default function Contact() {
  return (
    <div className={styles.topSection}>
      <div className={styles.container}>
        <div className={styles.blueBox}></div>
        <div className={styles.whiteBox}>
          <div className={styles.animalWrapper}>
            <Image src={Cow} alt="Cow holding ipod" className={styles.cow} />
            <Image
              src={CowPhone}
              alt="Cow holding ipod"
              className={styles.cowphone}
            />
          </div>
        </div>
        <div className={styles.blueBox}>
          <div className={styles.textContent}>
            <button className={styles.button}>CONTACT A Mentor</button>
            <p>
              MENTORS can help you with supporting developers and designers...
            </p>
          </div>
        </div>
        <div className={styles.whiteBox}></div>
      </div>
      <div className={styles.container}>
        <div className={styles.whiteBox}></div>
        <div className={styles.blueBox}>
          <div className={styles.textContent}>
            <p>
              DIRECTORS can help you with any questions regarding hackathon
              events, planning, whatever whatever whatever!
            </p>
            <button className={styles.button}>CONTACT A Director</button>
          </div>
        </div>
        <div className={styles.whiteBox}>
          <div className={styles.animalWrapper}>
            <Image src={Duck} alt="Duck holding ipod" className={styles.duck} />
            <Image
              src={DuckPhone}
              alt="Duck holding ipod"
              className={styles.duckphone}
            />
          </div>
        </div>
        <div className={styles.blueBox}></div>
      </div>
      <Image
        src={Squiggle}
        alt="Squiggle blue line divider"
        className={styles.squiggle}
      />
    </div>
  );
}
