import styles from './SubmissionDue.module.scss';
// import Image from 'next/image';

export default function SubmissionDue() {
  return (
    <>
      <div className={styles.SubDuecontainer}>
        <h1 className={styles.heading}> Rubric</h1>
        <div className={styles.boxContainer}>
          <div className={styles.box}>
            <p>60% Track-Specific</p>
          </div>
          <div className={styles.box}>
            <div className={styles.box3}>
              <p>20% Social Good</p>
            </div>
            <div className={styles.box3}>
              <p>10% Creativity</p>
            </div>
            <div className={styles.box3}>
              <p>10% Presentation</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
