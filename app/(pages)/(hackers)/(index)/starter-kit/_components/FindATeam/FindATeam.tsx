// import { Card, CardContent } from '@globals/components/ui/card';
// interface WorkshopSlidesProps {
//   subtitle: string;
//   title: string;
//   children: React.ReactNode;
// }

import StarterKitSlide from '../StarterKitSlide';
import styles from './FindATeam.module.scss';
// import Image from 'next/image';

const questions = [
  {
    text: 'IS THIS PERSON PASSIONATE ABOUT THE SAME TRACK(S)?',
    color: styles.qboxBlue,
  },
  {
    text: 'DOES THIS PERSON’S SKILLS COMPLIMENT MINE?',
    color: styles.qboxYellow,
  },
  {
    text: 'CAN I SEE MYSELF WORKING WITH THEM FOR 24 HOURS?',
    color: styles.qboxGreen,
  },
];

export default function FindATeam() {
  return (
    <div>
      <StarterKitSlide
        subtitle="GUIDING QUESTIONS"
        title="Finding the right fit"
      >
        <div className={styles.Container}>
          <div className={styles.questions}>
            <h3>Ask yourself questions like...</h3>
            <div className={styles.questionBoxes}>
              {questions.map((q, index) => (
                <div key={index} className={`${styles.qbox} ${q.color}`}>
                  <p>{q.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </StarterKitSlide>
    </div>
  );
}
