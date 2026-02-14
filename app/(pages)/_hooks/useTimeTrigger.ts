'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export function useTimeTrigger(triggerTime: number, callback: any) {
  const timerRef = useRef<any>(null);
  const callbackRef = useRef(callback);
  const [triggered, setTriggered] = useState(false);
  const router = useRouter();

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

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
      timerRef.current = setTimeout(async () => {
        await callbackRef.current?.();
        router.refresh();
        setTriggered(true);
      }, timeToTrigger);
    };

    const onFocus = () => {
      updateTimer();
    };

    window.addEventListener('focus', onFocus);
    updateTimer();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      window.removeEventListener('focus', onFocus);
    };
  }, [triggerTime, router]);

  return { triggered };
}
