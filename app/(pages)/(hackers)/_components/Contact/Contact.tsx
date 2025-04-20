import styles from './Contact.module.scss';
import Image from 'next/image';
import Squiggle from 'public/hackers/hero/SquiggleBorder.svg';
import CowPhone from 'public/hackers/hero/CowPhone.svg';
import Cow from 'public/hackers/hero/AirpodCow.svg';
import DuckPhone from 'public/hackers/hero/DuckPhone.svg';
import Duck from 'public/hackers/hero/AirpodDuck.svg';

export default function Contact() {
  return (
    <>
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
              <a href="https://discord.gg/Ba5xAtf8">
                <button className={styles.button}>CONTACT A MENTOR</button>
              </a>
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
              <a href="https://discord.gg/Wu3NzsPW">
                <button className={styles.button}>CONTACT A DIRECTOR</button>
              </a>
            </div>
          </div>
          <div className={styles.whiteBox}>
            <div className={styles.animalWrapper}>
              <Image
                src={Duck}
                alt="Duck holding ipod"
                className={styles.duck}
              />
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

      {/* mobile section starts here */}
      {/* <!-- Mentor Card --> */}
      <div className={styles.mobile}>
        <div className={styles.cardMentor}>
          <div className={styles.mobileanimalWrapper}>
            <Image
              src={Cow}
              alt="Duck holding ipod"
              className={styles.mobilecow}
            />
            <Image
              src={CowPhone}
              alt="Duck holding ipod"
              className={styles.mobilecowphone}
            />
          </div>
          <div className={styles.mobileText}>
            <Image
              src={Squiggle}
              alt="Squiggle blue line divider"
              className={styles.mobilesquiggle}
            />
            <p>
              MENTORS can support you with feedback in development and
              designing. Feel free to call one over!
            </p>
            <a href="https://discord.gg/Ba5xAtf8">
              <button>CONTACT A MENTOR</button>
            </a>
          </div>
        </div>

        {/* <!-- Director Card --> */}
        <div className={styles.cardDirector}>
          <div className={styles.mobileanimalWrapper}>
            <Image
              src={Duck}
              alt="Duck holding ipod"
              className={styles.mobileduck}
            />
            <Image
              src={DuckPhone}
              alt="Duck holding ipod"
              className={styles.mobileduckphone}
            />
          </div>
          <div className={styles.mobileText}>
            <Image
              src={Squiggle}
              alt="Squiggle blue line divider"
              className={styles.mobilesquiggle}
            />
            <p>
              DIRECTORS can help you with any questions regarding hackathon
              events, schedules, and overall logistics!
            </p>
            <a href="https://discord.gg/Wu3NzsPW">
              <button>CONTACT A DIRECTOR</button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
