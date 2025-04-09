'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  getEventsForOneUser,
  getUsersForOneEvent,
} from '@actions/userToEvents/getUserToEvent';
import { createUserToEvent } from '@actions/userToEvents/createUserToEvent';
import { deleteUserToEvent } from '@actions/userToEvents/deleteUserToEvent';
import { getEvents } from '@actions/events/getEvent';
import Event from '@typeDefs/event';

interface ScheduleData {
  [dayKey: string]: EventDetails[];
}

interface EventDetails {
  event: Event;
  attendeeCount: number;
  inPersonalSchedule: boolean;
}

interface UseScheduleDataProps {
  userId: string;
}

export function useScheduleData({ userId }: UseScheduleDataProps) {
  // State for events and loading states
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [personalEventIds, setPersonalEventIds] = useState<Set<string>>(
    new Set()
  );
  const [attendeeCounts, setAttendeeCounts] = useState<Record<string, number>>(
    {}
  );
  const [isLoadingPersonal, setIsLoadingPersonal] = useState(true);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isLoadingAttendees, setIsLoadingAttendees] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Track if we've already fetched attendee counts
  const fetchedAttendeeIds = useRef<Set<string>>(new Set());

  // Keep track of the last fetch timestamp to avoid redundant fetches
  const lastFetchTimestamp = useRef<Record<string, number>>({
    events: 0,
    personal: 0,
    attendees: 0,
  });

  // 1. Fetch all events (main schedule)
  const fetchAllEvents = useCallback(async () => {
    // Avoid frequent refetches (throttle to once every 30 seconds)
    const now = Date.now();
    if (now - lastFetchTimestamp.current.events < 30000) {
      return;
    }

    try {
      setIsLoadingEvents(true);
      const response = await getEvents({});
      if (!response.ok) {
        throw new Error(response.error || 'Failed to fetch events');
      }

      setAllEvents(response.body);
      lastFetchTimestamp.current.events = now;
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(
        `Error fetching events: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    } finally {
      setIsLoadingEvents(false);
    }
  }, []);

  // 2. Fetch personal events
  const fetchPersonalEvents = useCallback(async () => {
    if (!userId) return;

    // Avoid frequent refetches
    const now = Date.now();
    if (now - lastFetchTimestamp.current.personal < 30000) {
      return;
    }

    try {
      setIsLoadingPersonal(true);
      const result = await getEventsForOneUser(userId);

      if (result.ok) {
        // Extract event IDs from relations
        const eventIds = new Set(
          result.body
            .filter((relation: any) => relation.event_id)
            .map((relation: any) => relation.event_id)
        );

        setPersonalEventIds(eventIds);
        lastFetchTimestamp.current.personal = now;
      } else if (!result.error?.includes('No matching userToEvent found')) {
        setError(result.error || 'Failed to fetch personal events');
      }
    } catch (err) {
      console.error('Error fetching personal events:', err);
      setError(
        `Error fetching personal events: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    } finally {
      setIsLoadingPersonal(false);
    }
  }, [userId]);

  // 3. Fetch attendee counts (throttled and batched)
  const fetchAttendeeCounts = useCallback(
    async (eventIds: string[]) => {
      // Only fetch attendee counts for events we haven't fetched yet
      const newEventIds = eventIds.filter(
        (id) => !fetchedAttendeeIds.current.has(id)
      );

      if (newEventIds.length === 0) return;

      // Avoid frequent refetches
      const now = Date.now();
      if (now - lastFetchTimestamp.current.attendees < 30000) {
        return;
      }

      try {
        setIsLoadingAttendees(true);

        const counts: Record<string, number> = { ...attendeeCounts };

        // Process in batches to reduce API load
        const batchSize = 5;
        for (let i = 0; i < newEventIds.length; i += batchSize) {
          const batch = newEventIds.slice(i, i + batchSize);

          // Process batch in parallel
          await Promise.all(
            batch.map(async (eventId) => {
              if (!eventId) return;

              try {
                const result = await getUsersForOneEvent(eventId);

                if (result.ok) {
                  const responseCopy = JSON.parse(JSON.stringify(result.body));
                  counts[eventId] = responseCopy ? responseCopy.length : 0;
                } else if (
                  result.error?.includes('No matching userToEvent found')
                ) {
                  counts[eventId] = 0;
                }

                // Mark this ID as fetched
                fetchedAttendeeIds.current.add(eventId);
              } catch (error) {
                console.error(
                  `Error fetching attendees for event ${eventId}:`,
                  error
                );
                counts[eventId] = 0;
              }
            })
          );
        }

        setAttendeeCounts(counts);
        lastFetchTimestamp.current.attendees = now;
      } catch (err) {
        console.error('Error fetching attendees:', err);
      } finally {
        setIsLoadingAttendees(false);
      }
    },
    [attendeeCounts]
  );

  // 4. Add event to personal schedule
  const addToPersonalSchedule = useCallback(
    async (eventId: string) => {
      if (!userId || !eventId) return false;

      try {
        const result = await createUserToEvent(userId, eventId);

        if (result.ok) {
          // Update locally first for immediate UI feedback
          setPersonalEventIds((prev) => new Set([...prev, eventId]));

          // Then refresh from server
          await fetchPersonalEvents();

          // Update the attendee count for this event
          await fetchAttendeeCounts([eventId]);

          return true;
        } else {
          setError(result.error || 'Failed to add event to personal schedule');
          return false;
        }
      } catch (err) {
        console.error('Error adding to personal schedule:', err);
        setError(
          `Error adding event: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
        return false;
      }
    },
    [userId, fetchPersonalEvents, fetchAttendeeCounts]
  );

  // 5. Remove event from personal schedule
  const removeFromPersonalSchedule = useCallback(
    async (eventId: string) => {
      if (!userId || !eventId) return false;

      try {
        const result = await deleteUserToEvent({
          user_id: userId,
          event_id: eventId,
        });

        if (result.ok) {
          // Update locally first for immediate UI feedback
          setPersonalEventIds((prev) => {
            const newSet = new Set(prev);
            newSet.delete(eventId);
            return newSet;
          });

          // Then refresh from server
          await fetchPersonalEvents();

          // Update the attendee count for this event
          await fetchAttendeeCounts([eventId]);

          return true;
        } else {
          setError(
            result.error || 'Failed to remove event from personal schedule'
          );
          return false;
        }
      } catch (err) {
        console.error('Error removing from personal schedule:', err);
        setError(
          `Error removing event: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
        return false;
      }
    },
    [userId, fetchPersonalEvents, fetchAttendeeCounts]
  );

  // 6. Check if an event is in personal schedule
  const isInPersonalSchedule = useCallback(
    (eventId: string): boolean => {
      return personalEventIds.has(eventId);
    },
    [personalEventIds]
  );

  // 7. Prepare formatted schedule data
  const scheduleData = useMemo(() => {
    if (!allEvents.length) return null;

    // Group events by day
    return allEvents.reduce((acc: ScheduleData, event) => {
      const dayKey = event.start_time.toLocaleString('en-US', {
        timeZone: 'America/Los_Angeles',
        day: 'numeric',
      });

      if (!acc[dayKey]) {
        acc[dayKey] = [];
      }

      acc[dayKey].push({
        event,
        attendeeCount: attendeeCounts[event._id || ''] || 0,
        inPersonalSchedule: isInPersonalSchedule(event._id || ''),
      });

      return acc;
    }, {});
  }, [allEvents, attendeeCounts, isInPersonalSchedule]);

  // 8. Prepare personal schedule data
  const personalScheduleData = useMemo(() => {
    if (!allEvents.length || !personalEventIds.size) return {};

    // Filter events in personal schedule and group by day
    const personalEvents = allEvents.filter((event) =>
      isInPersonalSchedule(event._id || '')
    );

    return personalEvents.reduce((acc: ScheduleData, event) => {
      const dayKey = event.start_time.toLocaleString('en-US', {
        timeZone: 'America/Los_Angeles',
        day: 'numeric',
      });

      if (!acc[dayKey]) {
        acc[dayKey] = [];
      }

      acc[dayKey].push({
        event,
        attendeeCount: attendeeCounts[event._id || ''] || 0,
        inPersonalSchedule: true,
      });

      return acc;
    }, {});
  }, [allEvents, personalEventIds, attendeeCounts, isInPersonalSchedule]);

  // Initial data fetching
  useEffect(() => {
    fetchAllEvents();
  }, [fetchAllEvents]);

  useEffect(() => {
    if (userId) {
      fetchPersonalEvents();
    }
  }, [userId, fetchPersonalEvents]);

  // Fetch attendee counts whenever we have events
  useEffect(() => {
    if (allEvents.length > 0) {
      const eventIds = allEvents
        .map((event) => event._id)
        .filter((id): id is string => typeof id === 'string');

      // Only fetch for a small batch at a time (first 10 events)
      // Further events will be fetched as needed
      fetchAttendeeCounts(eventIds.slice(0, 10));
    }
  }, [allEvents, fetchAttendeeCounts]);

  // Return everything needed by the component
  return {
    scheduleData,
    personalScheduleData,
    isLoading: isLoadingEvents || isLoadingPersonal || isLoadingAttendees,
    error,
    attendeeCounts,
    addToPersonalSchedule,
    removeFromPersonalSchedule,
    isInPersonalSchedule,
    refreshData: async () => {
      await Promise.all([fetchAllEvents(), fetchPersonalEvents()]);
    },
  };
}
