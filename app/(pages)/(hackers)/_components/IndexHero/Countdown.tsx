'use client';

import styles from './Countdown.module.scss';
import { useState, useEffect } from 'react';

const COUNTDOWN_TARGET = new Date('2025-04-19T11:00:00-08:00');

export default function Countdown() {
  const calculateTimeLeft = () => {
    const now = Date.now();
    const targetTime = COUNTDOWN_TARGET.getTime();
    const difference = targetTime - now;

    // when done, display 00:00:00
    if (difference <= 0) return { hours: 0, minutes: 0, seconds: 0 };

    // if > 24 hours before judging time, cap the display at 24:00:00
    if (difference > 24 * 60 * 60 * 1000)
      return { hours: 24, minutes: 0, seconds: 0 };

    // actual functionality
    return {
      hours: Math.floor(difference / (1000 * 60 * 60)),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.time_countdown}>
        <div>
          <p>HOURS</p>
          <p className={`${styles.countdown_text}`}>
            {timeLeft.hours.toString().padStart(2, '0')}
          </p>
        </div>
        <p className={styles.countdown_text}>{' : '}</p>
        <div>
          <p>MINUTES</p>
          <p className={`${styles.countdown_text}`}>
            {timeLeft.minutes.toString().padStart(2, '0')}
          </p>
        </div>
        <p className={styles.countdown_text}>{' : '}</p>
        <div>
          <p className={styles.seconds}>SECONDS</p>
          <p className={`${styles.countdown_text} ${styles.fixed_text}`}>
            {timeLeft.seconds.toString().padStart(2, '0')}
          </p>
        </div>
      </div>
    </div>
  );
}
