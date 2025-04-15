"use client";

import { useState, useEffect } from "react";

type CountdownProps = {
  targetTime: string;
};

const Countdown = ({ targetTime }: CountdownProps) => {
  const calculateTimeLeft = () => {
    const difference = new Date(targetTime).getTime() - new Date().getTime();
    if (difference <= 0) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }
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
  }, [targetTime]);

  return (
    <div>
      <span>{timeLeft.hours.toString().padStart(2, "0")}</span> :{" "}
      <span>{timeLeft.minutes.toString().padStart(2, "0")}</span> :{" "}
      <span>{timeLeft.seconds.toString().padStart(2, "0")}</span>
    </div>
  );
};

const TimeTracker = ({ targetTime }: { targetTime?: string }) => {
  const getNextSaturday11AM = () => {
    const now = new Date();
    const target = new Date(now);
    let daysUntilSaturday = (6 - now.getDay() + 7) % 7;
    if (daysUntilSaturday === 0 && now.getHours() >= 11) {
      daysUntilSaturday = 7;
    }
    target.setDate(now.getDate() + daysUntilSaturday);
    target.setHours(11, 0, 0, 0);
    return target.toISOString();
  };

  const effectiveTargetTime = targetTime || getNextSaturday11AM();

  return <Countdown targetTime={effectiveTargetTime} />;
};

export default TimeTracker;
