import StarterKitSlide from '../../StarterKit/StarterKitSlide';
import styles from './SubmissionTips.module.scss';
import Animals from 'public/hackers/mvp/PeepingAnimals.svg';
import Image from 'next/image';
import Link from 'next/link';
import arrow from 'public/hackers/mvp/arrow.svg';

const questions = [
  {
    text: 'PICKED 4 RELEVANT PRIZE TRACKS',
    color: styles.qboxGreen,
  },
  {
    text: 'LINKED YOUR GITHUB AND/OR FIGMA LINK',
    color: styles.qboxYellow,
  },
  {
    text: 'INSERTED A DEMO VIDEO',
    color: styles.qboxBlue,
  },
];

export default function SubmissionTips() {
  return (
    <StarterKitSlide subtitle="HERE ARE SOME" title="Devpost Submission Tips">
      <div className={styles.Container}>
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

        <div className={styles.animalcontainer}>
          <Image
            src={Animals}
            alt="Animals Peeping Behind Wall"
            className={styles.peepingAnimals}
            fill={true}
          />
        </div>
        <div className={styles.button}>
          <Link href="/starter-kit" className={styles.button_background}>
            <button>
              <Image src={arrow} alt="arrow" />
              FOR YOUR DEVPOST SUBMISSION
            </button>
          </Link>
        </div>
      </div>
    </StarterKitSlide>
  );
}
