'use client';

import { useEffect, useState } from 'react';
import { usePersonalEvents } from '@hooks/usePersonalEvents';
import useActiveUser from '@pages/_hooks/useActiveUser';
import { useEvents } from '@hooks/useEvents';
import CalendarItem from '../Schedule/CalendarItem';

export default function NextSchedule() {
  const [nextEventData, setNextEventData] = useState<{
    event: Event | null;
    attendeeCount: number;
    inPersonalSchedule: boolean;
  }>({
    event: null,
    attendeeCount: 0,
    inPersonalSchedule: false,
  });

  const { user } = useActiveUser('/');
  const { personalEvents, isLoading, refreshPersonalEvents } =
    usePersonalEvents(user?._id || '');
  const {
    eventData,
    isLoading: eventsLoading,
    refreshEvents,
  } = useEvents(user);

  useEffect(() => {
    if (user?._id) {
      refreshPersonalEvents();
      refreshEvents();
    }
  }, [user?._id, refreshPersonalEvents, refreshEvents]);

  useEffect(() => {
    if (
      !isLoading &&
      !eventsLoading &&
      personalEvents &&
      personalEvents.length > 0
    ) {
      const now = new Date();
      const upcomingEvents = personalEvents.filter(
        (event) => new Date(event.start_time) > now
      );

      if (upcomingEvents.length > 0) {
        const sortedEvents = [...upcomingEvents].sort(
          (a, b) =>
            new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
        );

        const nextEvent = sortedEvents[0];
        const eventWithCount = eventData.find(
          (e) => e.event._id === nextEvent._id
        );

        setNextEventData({
          event: nextEvent as unknown as Event, // please dont read this code T^T. 6 am brain
          attendeeCount: eventWithCount?.attendeeCount || 0,
          inPersonalSchedule: true,
        });
      } else {
        setNextEventData({
          event: null,
          attendeeCount: 0,
          inPersonalSchedule: false,
        });
      }
    }
  }, [personalEvents, isLoading, eventsLoading, eventData]);

  const { event, attendeeCount, inPersonalSchedule } = nextEventData;

  if (!event) {
    return null;
  }

  return (
    <>
      <CalendarItem
        event={event}
        attendeeCount={attendeeCount}
        inPersonalSchedule={inPersonalSchedule}
      />
    </>
  );
}
