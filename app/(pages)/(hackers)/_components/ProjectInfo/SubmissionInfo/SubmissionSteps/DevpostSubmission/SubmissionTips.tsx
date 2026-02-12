import StarterKitSlide from '@pages/(hackers)/_components/StarterKit/StarterKitSlide';
import styles from './SubmissionTips.module.scss';
import Animals from 'public/hackers/project-info/peepingAnimals.png';
import Image from 'next/image';
import Link from 'next/link';
import arrow from 'public/hackers/mvp/arrow.svg';

const questions = [
  {
    text: 'PICKED 4 RELEVANT PRIZE TRACKS',
    color: styles.qboxGreen,
  },
  {
    text: 'ADDED YOUR GITHUB AND/OR FIGMA LINKS',
    color: styles.qboxYellow,
  },
  {
    text: 'INSERTED A DEMO VIDEO',
    color: styles.qboxBlue,
  },
];

export default function SubmissionTips() {
  return (
    <StarterKitSlide
      subtitle="HERE ARE SOME"
      title="Devpost Submission Tips"
      route="project-info"
    >
      <div className={styles.container}>
        <div className={styles.questions}>
          <h3>Be sure you...</h3>
          <div className={styles.questionBoxes}>
            {questions.map((q, index) => (
              <div key={index} className={`${styles.qbox} ${q.color}`}>
                <p>{q.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.devpost_box}>
          <Image
            src={Animals}
            alt="Animals Peeping Behind Wall"
            className={styles.peeping_animals}
          />
          <div className={styles.devpost_submission}>
            <Link
              href="https://hackdavis-2025.devpost.com/"
              className={styles.button}
              target="_blank"
            >
              <Image src={arrow} alt="arrow" />
              <p>
                FOR YOUR
                <br />
                DEVPOST
                <br />
                SUBMISSION
              </p>
            </Link>
          </div>
        </div>
      </div>
    </StarterKitSlide>
  );
}
