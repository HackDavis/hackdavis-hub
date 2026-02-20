'use client';

import { useMemo, useState, useEffect } from 'react';
import Event from '@typeDefs/event';
import { useEvents } from '@hooks/useEvents';
import { usePersonalEvents } from '@hooks/usePersonalEvents';
import useActiveUser from '@pages/_hooks/useActiveUser';
import {
  isScheduleEventLive,
  startsScheduleEventInNextMs,
} from '@pages/(hackers)/_components/Schedule/scheduleTime';

export interface EventEntry {
  event: Event;
  attendeeCount: number;
  inPersonalSchedule: boolean;
}

const THIRTY_MIN_MS = 30 * 60 * 1000;

const toSorted = (events: EventEntry[]): EventEntry[] =>
  [...events].sort(
    (a, b) =>
      new Date(a.event.start_time).getTime() -
      new Date(b.event.start_time).getTime()
  );

export function useScheduleSneakPeekData() {
  const { user } = useActiveUser('/');
  const { eventData } = useEvents(user);
  const {
    personalEvents,
    addToPersonalSchedule,
    removeFromPersonalSchedule,
    isInPersonalSchedule,
  } = usePersonalEvents(user?._id || '');

  const allEventEntries = useMemo<EventEntry[]>(() => {
    return eventData.map((item) => ({
      event: item.event,
      attendeeCount: item.attendeeCount || 0,
      inPersonalSchedule: isInPersonalSchedule(item.event._id || ''),
    }));
  }, [eventData, isInPersonalSchedule]);

  const personalEventEntries = useMemo<EventEntry[]>(() => {
    return personalEvents.map((event) => {
      const withCount = eventData.find((item) => item.event._id === event._id);
      return {
        event,
        attendeeCount: withCount?.attendeeCount || 0,
        inPersonalSchedule: true,
      };
    });
  }, [personalEvents, eventData]);

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000); // Update every 60 seconds
    return () => clearInterval(interval);
  }, []);

  const filteredLists = useMemo(
    () => ({
      liveAll: toSorted(
        allEventEntries.filter((entry) => isScheduleEventLive(entry.event, now))
      ),
      upcomingAll: toSorted(
        allEventEntries.filter((entry) =>
          startsScheduleEventInNextMs(entry.event, THIRTY_MIN_MS, now)
        )
      ),
      livePersonal: toSorted(
        personalEventEntries.filter((entry) =>
          isScheduleEventLive(entry.event, now)
        )
      ),
      upcomingPersonal: toSorted(
        personalEventEntries.filter((entry) =>
          startsScheduleEventInNextMs(entry.event, THIRTY_MIN_MS, now)
        )
      ),
    }),
    [allEventEntries, personalEventEntries, now]
  );

  return {
    ...filteredLists,
    addToPersonalSchedule,
    removeFromPersonalSchedule,
  };
}
