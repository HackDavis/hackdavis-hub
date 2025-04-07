'use client';

import Image from 'next/image';
import SubmissionCharacters from 'public/hackers/project-info/submissionCharacters.png';
import styles from './SubmissionDue.module.scss';

const criteria = [
  {
    percentage: 60,
    criterion: 'Track-Specific',
  },
  {
    percentage: 20,
    criterion: 'Social Good',
  },
  {
    percentage: 10,
    criterion: 'Creativity',
  },
  {
    percentage: 10,
    criterion: 'Presentation',
  },
];

export default function SubmissionDue() {
  return (
    <div className={styles.container}>
      <div className={styles.background}>
        <div className={styles.characters}>
          <Image src={SubmissionCharacters} alt="Chracters" />
        </div>
        <div className={styles.criteria}>
          <h6>Rubric</h6>
          <div className={styles.table}>
            {criteria.map(({ percentage, criterion }, index) => (
              <div
                key={index}
                style={{
                  width: `${percentage}%`,
                }}
              >
                {percentage}% {criterion}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
