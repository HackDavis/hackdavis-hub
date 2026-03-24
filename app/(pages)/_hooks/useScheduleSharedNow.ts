'use client';
import { useState, useEffect } from 'react';

let sharedNow = Date.now();
let sharedNowInterval: ReturnType<typeof setInterval> | null = null;
const subscribers = new Set<(now: number) => void>();

export function useSharedNow(): number {
  const [now, setNow] = useState(sharedNow);

  useEffect(() => {
    const callback = (latest: number) => setNow(latest);
    subscribers.add(callback);

    if (sharedNowInterval === null) {
      sharedNowInterval = setInterval(() => {
        sharedNow = Date.now();
        subscribers.forEach((cb) => cb(sharedNow));
      }, 1000);
    }

    return () => {
      subscribers.delete(callback);
      if (subscribers.size === 0 && sharedNowInterval) {
        clearInterval(sharedNowInterval);
        sharedNowInterval = null;
      }
    };
  }, []);

  return now;
}
