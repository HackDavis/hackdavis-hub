'use client';

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
    const calculateTimeLeft = () => {
      const now = Date.now();
      const difference = countdownTarget - now;

      if (difference <= 0) {
        return { hours: 0, minutes: 0, seconds: 0 };
      }

      if (difference > 24 * 60 * 60 * 1000) {
        return { hours: 24, minutes: 0, seconds: 0 };
      }

      return {
        hours: Math.floor(difference / (1000 * 60 * 60)),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [countdownTarget]);

  const timerStyle = {
    color: '#FFF',
    fontFamily: '"DM Mono", monospace',
    fontSize: 'clamp(36px, 12vw, 230.034px)',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: 'normal',
    letterSpacing: '4.601px',
    textShadow: '0 0 31.729px rgba(255, 255, 255, 0.30)',
  };

  return (
    <div className="flex flex-col items-end text-white">
      {/* BIG TIMER */}
      <div className="flex items-end gap-3 md:gap-6" style={timerStyle}>
        <span className="leading-none">
          {timeLeft.hours.toString().padStart(2, '0')}
        </span>

        <span className="leading-none">:</span>

        <span className="leading-none">
          {timeLeft.minutes.toString().padStart(2, '0')}
        </span>

        <span className="leading-none">:</span>

        <span className="leading-none">
          {timeLeft.seconds.toString().padStart(2, '0')}
        </span>
      </div>

      {/* LABEL ROW */}
      {/* <div className="flex gap-8 md:gap-14 mt-3 text-xs md:text-sm font-semibold tracking-widest opacity-90">
        <span>HOURS</span>
        <span>MINUTES</span>
        <span>SECONDS</span>
      </div> */}
    </div>
  );
}
