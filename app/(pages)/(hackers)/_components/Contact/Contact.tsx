import styles from './Contact.module.scss';
import Image from 'next/image';
import Squiggle from 'public/hackers/hero/SquiggleBorder.svg';

export default function Contact() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.blueBox}></div>
        <div className={styles.whiteBox}></div>
        <div className={styles.blueBox}>
          <p>
            MENTORS can help you with supporting developers and designers with
            any technical questions regarding their projects! Contact one now to
            ask about blah blah blah
          </p>
          <button className={styles.button}>CONTACT A Mentor</button>
        </div>
        <div className={styles.whiteBox}></div>
      </div>
      <div className={styles.container}>
        <div className={styles.whiteBox}></div>
        <div className={styles.blueBox}>
          <p>
            DIRECTORS can help you with any questions regarding hackathon
            events, planning, whatever whatever whatever!
          </p>
          <button className={styles.button}>CONTACT A Director</button>
        </div>
        <div className={styles.whiteBox}></div>
        <div className={styles.blueBox}></div>
      </div>
      <Image
        src={Squiggle}
        alt="Squiggle blue line divider"
        className={styles.squiggle}
      />
    </>
  );
}
