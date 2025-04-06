import styles from './FillOutDetails.module.scss';
import Image from 'next/image';
// import StarterKitSlide from '../SubmissionInfo';
// import Animals from 'public/hackers/project-info/submissionProcess.svg';
import Step5Overlay from 'public/hackers/project-info/Step5Overlay.svg';
import Blank from 'public/hackers/project-info/Step6.svg';

export default function FillOutDetails() {
  return (
    <div className={styles.container}>
      <p className={styles.text}>
        Fill out respective information - project overview, details, etc
      </p>

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
        src={Step5Overlay}
        alt="Animals on a beach playing instruments."
        className={styles.image}
      />
    </div>
  );
}
