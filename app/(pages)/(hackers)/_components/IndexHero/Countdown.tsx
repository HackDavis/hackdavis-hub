'use client';

import styles from './Countdown.module.scss';
import { useState, useEffect } from 'react';

interface CountdownProps {
  countdownTarget?: number;
}

export default function Countdown({
  countdownTarget = new Date('2026-04-20T07:00:00-07:00').getTime(),
}: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 24,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const calculateTimeLeft = () => {
        const now = Date.now();
        const difference = countdownTarget - now;

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
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [countdownTarget]);

  return (
    <div className={styles.container}>
      <div className={styles.time_countdown}>
        <div>
          <p className={styles.words}>HOURS</p>
          <p className={`${styles.countdown_text}`}>
            {timeLeft.hours.toString().padStart(2, '0')}
          </p>
        </div>
        <p className={styles.countdown_text}>{' : '}</p>
        <div>
          <p className={styles.words}>MINUTES</p>
          <p className={`${styles.countdown_text}`}>
            {timeLeft.minutes.toString().padStart(2, '0')}
          </p>
        </div>
        <p className={styles.countdown_text}>{' : '}</p>
        <div>
          <p className={styles.words}>SECONDS</p>
          <p className={`${styles.countdown_text} ${styles.fixed_text}`}>
            {timeLeft.seconds.toString().padStart(2, '0')}
          </p>
        </div>
      </div>
    </div>
  );
}
