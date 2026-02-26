'use client';

import { useMemo, useState, useEffect } from 'react';
import Event from '@typeDefs/event';
import { useEvents } from '@hooks/useEvents';
import { usePersonalEvents } from '@hooks/usePersonalEvents';
import useActiveUser from '@pages/_hooks/useActiveUser';
import { isScheduleEventLive } from '@pages/(hackers)/_components/Schedule/scheduleTime';

export interface EventEntry {
  event: Event;
  attendeeCount: number;
  inPersonalSchedule: boolean;
}

const toSorted = (events: EventEntry[]): EventEntry[] =>
  [...events].sort(
    (a, b) =>
      new Date(a.event.start_time).getTime() -
      new Date(b.event.start_time).getTime()
  );

/** Returns only the events starting at the single nearest future start time. */
const getNextBatchEvents = (entries: EventEntry[], now: Date): EventEntry[] => {
  const future = entries.filter(
    (e) => new Date(e.event.start_time).getTime() > now.getTime()
  );
  if (future.length === 0) return [];
  const earliest = Math.min(
    ...future.map((e) => new Date(e.event.start_time).getTime())
  );
  return future.filter(
    (e) => new Date(e.event.start_time).getTime() === earliest
  );
};

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

  const filteredLists = useMemo(() => {
    // GENERAL (and MEALS) events have no add button and must never appear in
    // Your Schedule. Filter them out so they always stay in Happening Now.
    const schedulablePersonalEntries = personalEventEntries.filter(
      (e) => e.event.type !== 'GENERAL' && e.event.type !== 'MEALS'
    );

    // Only exclude events that will actually appear in Your Schedule.
    const scheduledIds = new Set(
      schedulablePersonalEntries.map((e) => e.event._id)
    );
    const happeningNowEntries = allEventEntries.filter(
      (e) => !scheduledIds.has(e.event._id)
    );

    return {
      liveAll: toSorted(
        happeningNowEntries.filter((entry) =>
          isScheduleEventLive(entry.event, now)
        )
      ),
      upcomingAll: toSorted(getNextBatchEvents(happeningNowEntries, now)),
      livePersonal: toSorted(
        schedulablePersonalEntries.filter((entry) =>
          isScheduleEventLive(entry.event, now)
        )
      ),
      upcomingPersonal: toSorted(
        getNextBatchEvents(schedulablePersonalEntries, now)
      ),
    };
  }, [allEventEntries, personalEventEntries, now]);

  return {
    ...filteredLists,
    addToPersonalSchedule,
    removeFromPersonalSchedule,
  };
}
