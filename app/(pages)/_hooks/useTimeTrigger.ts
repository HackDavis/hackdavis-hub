'use client';
import { useState, useEffect, useRef } from 'react';

export function useTimeTrigger(triggerTime: number, callback: any) {
  const timerRef = useRef<any>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      const timeToTrigger = triggerTime - Date.now();
      if (timeToTrigger < 0) {
        setTriggered(true);
        return;
      }
      timerRef.current = setTimeout(() => {
        callback?.();
        setTriggered(true);
      }, timeToTrigger);
    };

    const onFocus = () => {
      updateTimer();
    };

    window.addEventListener('focus', onFocus);
    updateTimer();

    return () => {
      clearTimeout(timerRef.current);
      window.removeEventListener('focus', onFocus);
    };
  }, [triggerTime, callback]);

  return { triggered };
}
