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
        <div
          className={`${styles.blueBox} ${styles.textBox} ${styles.alignBottom}`}
        >
          <div className={styles.textContent}>
            <button className={styles.button}>CONTACT A Mentor</button>
            <p>
              MENTORS are here to support developers and designers with any
              technical challenges you might face during your project. Whether
              you're debugging, designing, or stuck on a problem, mentors are
              here to help.
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
              DIRECTORS can answer any questions you have about the hackathon
              itself — from logistics and scheduling to rules and submissions.
              If you're unsure where to go or what to do, they're your go-to
              guide.
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
