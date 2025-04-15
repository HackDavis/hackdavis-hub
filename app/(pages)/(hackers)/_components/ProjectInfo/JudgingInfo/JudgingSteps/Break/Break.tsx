'use client';

import Image from 'next/image';
import RelaxingCow from 'public/hackers/project-info/relaxingCow.svg';
import Radio from 'public/hackers/project-info/radio.svg';
import styles from './Break.module.scss';

export default function Break() {
  return (
    <div className={styles.container}>
      <div className={styles.tile}>
        <div className={styles.left}>
          <h2>Hacker's Choice Award</h2>
          <p>
            Once demos end, you will about an hour's time to visit other teams
            and vote for the <span>Hacker's Choice Award.</span> You can also
            look at projects in the gallery on devpost.
          </p>
          <p>
            Meanwhile, panels of judges will be choosing the winners from the
            top 5 projects shortlisted for each track after demos.
          </p>
          {/* TODO: add devpost public voting link */}
          {/* <a
            href="https://www.google.com"
            target="_blank"
            className={styles.link}
          >
            Submit Vote
          </a> */}
        </div>
        <div className={styles.right}>
          <Image src={RelaxingCow} alt="Relaxing Cow" />
          <Image src={Radio} alt="Radio" className={styles.radio} />
        </div>
      </div>
    </div>
  );
}
