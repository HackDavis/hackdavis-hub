import styles from './InviteTeammates.module.scss';
import Image from 'next/image';
// import StarterKitSlide from '../SubmissionInfo';
// import Animals from 'public/hackers/project-info/submissionProcess.svg';
import Step4Overlay from 'public/hackers/project-info/Step4Overlay.svg';
import Blank from 'public/hackers/project-info/Step6.svg';

export default function InviteTeammates() {
  return (
    <div className={styles.container}>
      <p className={styles.text}>Invite teammates.</p>

      <div className={styles.imageWrapper}>
        <Image
          src={Blank}
          alt="Primary Step 1"
          fill
          style={{ objectFit: 'contain' }}
          className={styles.primaryImage}
        />
      </div>

      <Image
        src={Step4Overlay} // primary image
        alt="Animals on a beach playing instruments."
        className={styles.image}
      />
      <div className={styles.floor}></div>
    </div>
  );
}
