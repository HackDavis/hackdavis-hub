'use client';

import { useEffect, useState } from 'react';
import { usePersonalEvents } from '@hooks/usePersonalEvents';
import Event from '@typeDefs/event';
import useActiveUser from '@pages/_hooks/useActiveUser';
import { useEvents } from '@hooks/useEvents';
import { getScheduleEventEndTime } from '@pages/(hackers)/_components/Schedule/scheduleTime';

export interface NextEventData {
  event: Event | null;
  attendeeCount: number;
  inPersonalSchedule: boolean;
}

export function useNextSchedule() {
  const [nextEventData, setNextEventData] = useState<NextEventData>({
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

  // Force refresh data on mount to ensure consistency with schedule page
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

      // Include events that haven't ended yet (covers both currently happening and future events)
      const upcomingEvents = personalEvents.filter(
        (event) => getScheduleEventEndTime(event).getTime() > now.getTime()
      );

      if (upcomingEvents.length > 0) {
        // Sort by start time (ascending) and take the first one
        const sortedEvents = [...upcomingEvents].sort(
          (a, b) =>
            new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
        );

        const nextEvent = sortedEvents[0];

        // Find attendee count from eventData
        const eventWithCount = eventData.find(
          (e) => e.event._id === nextEvent._id
        );

        setNextEventData({
          event: nextEvent,
          attendeeCount: eventWithCount?.attendeeCount || 0,
          inPersonalSchedule: true, // It's in personal events so this is always true
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

  return {
    event: nextEventData.event,
    attendeeCount: nextEventData.attendeeCount,
    inPersonalSchedule: nextEventData.inPersonalSchedule,
  };
}
