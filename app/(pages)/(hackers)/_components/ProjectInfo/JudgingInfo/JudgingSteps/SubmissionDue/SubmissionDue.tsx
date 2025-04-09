'use client';

import Image from 'next/image';
import PeekingCharacters from 'public/hackers/project-info/peekingCharacters.png';
import PeekingTwoCharacters from 'public/hackers/project-info/peekingTwoCharacters.png';
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
          <Image src={PeekingCharacters} alt="Characters" />
        </div>
        <div className={styles.characters_mobile}>
          <Image src={PeekingTwoCharacters} alt="Characters" />
        </div>
      </div>

      <div className={styles.foreground}>
        <div className={styles.criteria}>
          <h6>Rubric</h6>
          <div className={styles.table}>
            {criteria.map(({ percentage, criterion }, index) => (
              <div
                key={index}
                className={styles.criterion}
                style={{
                  width: `${percentage}%`,
                }}
              >
                {percentage}% {criterion}
              </div>
            ))}
          </div>

          <div className={styles.table_mobile}>
            <div
              className={styles.first_criterion}
              style={{
                width: '100%',
              }}
            >
              60% Track-Specific
            </div>
            <div className={styles.other_criteria}>
              <div
                className={styles.criterion}
                style={{
                  width: '50%',
                }}
              >
                20% Social Good
              </div>
              <div
                className={styles.criterion}
                style={{
                  width: '25%',
                }}
              >
                10% Creativity
              </div>
              <div
                className={styles.criterion}
                style={{
                  width: '25%',
                }}
              >
                10% Presentation
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
