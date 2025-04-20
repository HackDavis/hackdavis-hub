'use client';

import { useState, useEffect } from 'react';

type CountdownProps = {
  targetTime: number;
};

const Countdown = ({ targetTime }: CountdownProps) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetTime - new Date().getTime();
      if (difference <= 0) {
        return { hours: 0, minutes: 0, seconds: 0 };
      }
      return {
        hours: Math.floor(difference / (1000 * 60 * 60)),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetTime]);

  return (
    <div>
      <span>{timeLeft.hours.toString().padStart(2, '0')}</span> :{' '}
      <span>{timeLeft.minutes.toString().padStart(2, '0')}</span> :{' '}
      <span>{timeLeft.seconds.toString().padStart(2, '0')}</span>
    </div>
  );
};

type TimeTrackerProps = {
  targetTime?: number;
};

const TimeTracker = ({ targetTime }: TimeTrackerProps) => {
  const effectiveTargetTime =
    targetTime || new Date('2025-05-01T09:00:00Z').getTime();

  return <Countdown targetTime={effectiveTargetTime} />;
};

export default TimeTracker;
