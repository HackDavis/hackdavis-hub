import styles from './SubmissionDue.module.scss';
// import Image from 'next/image';

export default function SubmissionDue() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.boxContainer}>
          <h1 className={styles.heading}> Rubric</h1>
          <div className={styles.box}></div>
          <div className={styles.box}></div>
          <div className={styles.box}></div>
        </div>
      </div>
    </>
  );
}
