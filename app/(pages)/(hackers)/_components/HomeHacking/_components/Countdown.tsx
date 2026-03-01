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

  return (
    <div className="flex flex-col items-end text-white">
      {/* BIG TIMER */}
      <div className="flex items-end gap-3 md:gap-6">
        <span className="text-[72px] sm:text-[96px] md:text-[120px] font-extrabold tracking-wide leading-none drop-shadow-[0_6px_14px_rgba(0,0,0,0.18)]">
          {timeLeft.hours.toString().padStart(2, '0')}
        </span>

        <span className="text-[72px] sm:text-[96px] md:text-[120px] font-extrabold leading-none">
          :
        </span>

        <span className="text-[72px] sm:text-[96px] md:text-[120px] font-extrabold tracking-wide leading-none drop-shadow-[0_6px_14px_rgba(0,0,0,0.18)]">
          {timeLeft.minutes.toString().padStart(2, '0')}
        </span>

        <span className="text-[72px] sm:text-[96px] md:text-[120px] font-extrabold leading-none">
          :
        </span>

        <span className="text-[72px] sm:text-[96px] md:text-[120px] font-extrabold tracking-wide leading-none drop-shadow-[0_6px_14px_rgba(0,0,0,0.18)]">
          {timeLeft.seconds.toString().padStart(2, '0')}
        </span>
      </div>

      {/* LABEL ROW */}
      <div className="flex gap-8 md:gap-14 mt-3 text-xs md:text-sm font-semibold tracking-widest opacity-90">
        <span>HOURS</span>
        <span>MINUTES</span>
        <span>SECONDS</span>
      </div>
    </div>
  );
}
