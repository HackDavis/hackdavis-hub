import styles from './FillOutDetails.module.scss';
import Image from 'next/image';
// import StarterKitSlide from '../SubmissionInfo';
// import Animals from 'public/hackers/project-info/submissionProcess.svg';
import Step5Overlay from 'public/hackers/project-info/Step5Overlay.svg';
// import Blank from 'public/hackers/project-info/Step6.svg';
import fillOutDetails from 'public/hackers/project-info/fillOutDetails.png';

export default function FillOutDetails() {
  return (
    <div className={styles.container}>
      <p className={styles.text}>
        Fill out respective information — project overview, details, etc. <br />
        When selecting prize tracks: pick{' '}
        <strong>up to 4 HackDavis tracks</strong> via{' '}
        <strong>Tracks #1–#3</strong> on Devpost, and use the{' '}
        <strong>Opt-in Prizes</strong> section for any{' '}
        <strong>Sponsor, NPO, or MLH tracks</strong> your project qualifies for
        (no limit, but keep it relevant).
      </p>

      <div className={styles.imageWrapper}>
        <Image
          src={fillOutDetails}
          alt="Primary Step 1"
          fill
          style={{ objectFit: 'contain' }}
          className={styles.primaryImage}
        />
      </div>

      <Image
        src={Step5Overlay}
        alt="Animals on a beach playing instruments."
        className={styles.image}
      />
    </div>
  );
}
