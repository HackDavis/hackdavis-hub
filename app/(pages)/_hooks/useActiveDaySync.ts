'use client';

import { useCallback, useEffect, useRef } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { DAY_KEYS, DayKey } from '../(hackers)/_components/Schedule/constants';

interface UseActiveDaySyncOptions {
  activeDay: DayKey;
  setActiveDay: Dispatch<SetStateAction<DayKey>>;
  dayKeys?: readonly DayKey[];
  anchorRatio?: number;
  clickLockMs?: number;
  syncSignal?: unknown;
}

export function useActiveDaySync({
  activeDay,
  setActiveDay,
  dayKeys = DAY_KEYS,
  anchorRatio = 0.45,
  clickLockMs = 900,
  syncSignal,
}: UseActiveDaySyncOptions) {
  const ignoreScrollSyncUntilRef = useRef(0);
  const pendingDayRef = useRef<DayKey | null>(null);

  const updateActiveDayFromScroll = useCallback(() => {
    const anchor = window.innerHeight * anchorRatio;
    const pendingDay = pendingDayRef.current;

    if (pendingDay) {
      const pendingSection = document.getElementById(`day-${pendingDay}`);

      if (pendingSection) {
        const pendingRect = pendingSection.getBoundingClientRect();
        const pendingReached =
          pendingRect.top <= anchor + 8 && pendingRect.bottom > anchor;

        if (pendingReached) {
          setActiveDay((prev) => (prev === pendingDay ? prev : pendingDay));
          pendingDayRef.current = null;
          ignoreScrollSyncUntilRef.current = 0;
          return;
        }
      }

      if (Date.now() < ignoreScrollSyncUntilRef.current) {
        setActiveDay((prev) => (prev === pendingDay ? prev : pendingDay));
        return;
      }

      pendingDayRef.current = null;
    }

    const daySections = dayKeys
      .map((day) => {
        const section = document.getElementById(`day-${day}`);
        return section ? { day, rect: section.getBoundingClientRect() } : null;
      })
      .filter(
        (section): section is { day: DayKey; rect: DOMRect } => section !== null
      );

    if (daySections.length === 0) return;

    let nextActiveDay = daySections[0].day;
    for (const section of daySections) {
      if (section.rect.top <= anchor) {
        nextActiveDay = section.day;
      }
    }

    setActiveDay((prev) => (prev === nextActiveDay ? prev : nextActiveDay));
  }, [anchorRatio, dayKeys, setActiveDay]);

  useEffect(() => {
    updateActiveDayFromScroll();
    window.addEventListener('scroll', updateActiveDayFromScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', updateActiveDayFromScroll);
    };
  }, [updateActiveDayFromScroll]);

  useEffect(() => {
    updateActiveDayFromScroll();
  }, [activeDay, syncSignal, updateActiveDayFromScroll]);

  const changeActiveDay = useCallback(
    (day: DayKey) => {
      pendingDayRef.current = day;
      ignoreScrollSyncUntilRef.current = Date.now() + clickLockMs;
      setActiveDay((prev) => (prev === day ? prev : day));

      document
        .getElementById(`day-${day}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    [clickLockMs, setActiveDay]
  );

  return { changeActiveDay };
}
