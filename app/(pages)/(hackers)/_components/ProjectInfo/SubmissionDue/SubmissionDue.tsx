import styles from './SubmissionDue.module.scss';
// import Image from 'next/image';

export default function SubmissionDue() {
  return (
    <>
      <div className={styles.SubDuecontainer}>
        <h1 className={styles.heading}> Rubric</h1>
        <div className={styles.boxContainer}>
          <div className={styles.box}>60% Track-Specific</div>
          <div className={styles.box}>20% Social Good</div>
          <div className={styles.box}>10% Creativity</div>
          <div className={styles.box}>10% Presentation</div>
        </div>
      </div>
    </>
  );
}
