import styles from './SubmissionDue.module.scss';
import Image from 'next/image';
import JudgingAnimals from 'public/hackers/project-info/SubmissionDue.svg';
import JudgingAnimalsMobile from 'public/hackers/project-info/SubmissionDueMobile.svg';

export default function SubmissionDue() {
  return (
    <>
      <picture>
        <source media="(max-width: 425px)" srcSet={JudgingAnimalsMobile.src} />
        <Image
          className={styles.animals}
          src={JudgingAnimals}
          alt="4 Animals sitting at a table"
        />
      </picture>

      <div className={styles.pageWrapper}>
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
      </div>
    </>
  );
}
