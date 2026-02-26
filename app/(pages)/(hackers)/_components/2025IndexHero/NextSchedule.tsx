'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePersonalEvents } from '@hooks/usePersonalEvents';
import useActiveUser from '@pages/_hooks/useActiveUser';
import { useEvents } from '@hooks/useEvents';
import CalendarItem from '../Schedule/CalendarItem';
import Event from '@typeDefs/event';
import TimeTracker from './TimeTracker';
import { getScheduleEventEndTime } from '../Schedule/scheduleTime';
import star_icon from '@public/hackers/hero/star.svg';

import styles from './NextSchedule.module.scss';

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
      // Include events that haven't ended yet (covers both currently happening and future events)
      const upcomingEvents = personalEvents.filter(
        (event) => getScheduleEventEndTime(event).getTime() > now.getTime()
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
          event: nextEvent as Event,
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
  const nextEventTime = event?.start_time.getTime() || undefined;

  return (
    <div className={styles.group_width}>
      <div
        style={{
          display: 'flex',
          gap: '1%',
          paddingBottom: '1%',
          alignItems: 'center',
        }}
      >
        <p>NEXT ON YOUR SCHEDULE</p>
        <Image
          src={star_icon}
          alt="star icon"
          className={styles.star_icon_img}
        />
        {event && (
          <div className={styles.countdown}>
            <TimeTracker targetTime={nextEventTime} />
          </div>
        )}
      </div>
      {event && (
        <CalendarItem
          event={event}
          attendeeCount={attendeeCount}
          inPersonalSchedule={inPersonalSchedule}
        />
      )}
    </div>
  );
}
