'use client';

import Image from 'next/image';
import Podium from 'public/hackers/project-info/podium.svg';
import styles from './ClosingCeremony.module.scss';

export default function ClosingCeremony() {
  return (
    <div className={styles.container}>
      <div className={styles.tile}>
        <div className={styles.text}>
          <h2>We made it!</h2>
          <p>
            If your team needs to leave before/in the middle of closing
            ceremony, please inform someone at the Director Table.
          </p>
          <p>
            If your team wins a prize and is not at the venue, we will contact
            you via email after the event to get your prize to you.
          </p>
        </div>
      </div>
      <Image
        src={Podium}
        alt="Characters on podium"
        className={styles.podium}
      />
    </div>
  );
}
