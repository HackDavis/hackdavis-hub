'use client';

import styles from './Countdown.module.scss';
import { useState, useEffect } from 'react';

const COUNTDOWN_TARGET = new Date('2025-04-20T11:00:00-07:00');

export default function Countdown() {
  const calculateTimeLeft = () => {
    const difference =
      new Date(COUNTDOWN_TARGET).getTime() - new Date().getTime();
    if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
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

  const displayDays = timeLeft.days > 1;
  return (
    <div className={styles.container}>
      {/* {displayDays ? (
        <div className={styles.days_countdown}>
          <p>UNTIL THE HACKATHON</p>
          <p className={styles.countdown_text}>{timeLeft.days} Day</p>
        </div>
      ) : ( */}
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
      {/* )} */}
    </div>
  );
}
