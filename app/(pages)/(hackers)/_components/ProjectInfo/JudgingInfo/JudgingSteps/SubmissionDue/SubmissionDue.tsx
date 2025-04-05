'use client';

import Image from 'next/image';
import PeekingCow from 'public/hackers/project-info/peekingCow.svg';
import PeekingBunny from 'public/hackers/project-info/peekingBunny.svg';
import PeekingFroggy from 'public/hackers/project-info/peekingFroggy.svg';
import PeekingDucky from 'public/hackers/project-info/peekingDucky.svg';
import SubmissionDueSpeechBubble from 'public/hackers/project-info/submissionDueSpeechBubble.svg';
import styles from './SubmissionDue.module.scss';

export default function SubmissionDue() {
  return (
    <div className={styles.container}>
      <div className={styles.background}>
        <div className={styles.cow}>
          <Image src={PeekingCow} alt="Cow" />
        </div>
        <div className={styles.bunny}>
          <Image src={PeekingBunny} alt="Bunny" />
          <div className={styles.speech_bubble}>
            <Image src={SubmissionDueSpeechBubble} alt="Bunny" />
          </div>
        </div>
        <div className={styles.froggy}>
          <Image src={PeekingFroggy} alt="Froggy" />
        </div>
        <div className={styles.ducky}>
          <Image src={PeekingDucky} alt="Ducky" />
        </div>
      </div>
      <div className={styles.foreground}></div>
    </div>
  );
}
