'use client';

import { useState, useEffect, useCallback } from 'react';
import { getEvents } from '@actions/events/getEvent';
import { getUsersForOneEvent } from '@actions/userToEvents/getUserToEvent';
import Event, { EventTag } from '@typeDefs/event';
import User from '@typeDefs/user';

export interface EventData {
  event: Event;
  attendeeCount: number;
  isRecommended?: boolean;
}

export function useEvents(currentUser?: User | null) {
  const [eventData, setEventData] = useState<EventData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all events
  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getEvents({});

      if (response.ok) {
        const fetchedEvents = response.body.map((event: any) => {
          // Ensure dates are properly parsed
          if (event.start_time && typeof event.start_time === 'string') {
            event.start_time = new Date(event.start_time);
          }
          if (event.end_time && typeof event.end_time === 'string') {
            event.end_time = new Date(event.end_time);
          }
          return event;
        });

        return fetchedEvents;
      } else {
        setError(response.error || 'Failed to fetch events');
        return [];
      }
    } catch (err) {
      console.error('Error in fetchEvents:', err);
      setError(
        `Error fetching events: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch attendee count for all events and create enhanced event data
  const fetchEnhancedEventData = useCallback(
    async (eventsList: Event[]) => {
      try {
        setIsLoading(true);

        // Process events in parallel for efficiency
        const enhancedEvents = await Promise.all(
          eventsList.map(async (event) => {
            if (!event._id) return { event, attendeeCount: 0 };

            try {
              const result = await getUsersForOneEvent(event._id);
              const attendeeCount = result.ok ? result.body.length : 0;

              // Check if this event is recommended for the current user
              const isRecommended = checkIfRecommended(event, currentUser);

              return { event, attendeeCount, isRecommended };
            } catch (err) {
              console.error(
                `Error fetching attendees for event ${event._id}:`,
                err
              );
              return { event, attendeeCount: 0, isRecommended: false };
            }
          })
        );

        setEventData(enhancedEvents);
      } catch (err) {
        console.error('Error in fetchEnhancedEventData:', err);
        setError(
          `Error fetching attendee counts: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
      } finally {
        setIsLoading(false);
      }
    },
    [currentUser]
  );

  // Function to check if an event is recommended for a user
  const checkIfRecommended = (event: Event, user?: User | null): boolean => {
    // If no user or not a hacker or no position, then not recommended
    if (!user || user.role !== 'hacker' || !user.position) return false;

    // If event has no tags, then not recommended
    if (!event.tags || event.tags.length === 0) return false;

    // Check if user's position is included in event tags
    // return event.tags.includes(
    //   (user.position as EventTag) ||
    //     ((user.is_beginner ? 'beginner' : null) as EventTag)
    // );
    return (
      (event.tags.includes(user.position as EventTag) ||
        (user.is_beginner === true &&
          event.tags.includes('beginner' as EventTag))) ??
      false
    );
  };

  // Combined function to fetch events and their attendee counts
  const fetchEventsWithData = useCallback(async () => {
    try {
      const fetchedEvents = await fetchEvents();
      if (fetchedEvents.length > 0) {
        await fetchEnhancedEventData(fetchedEvents);
      }
    } catch (err) {
      console.error('Error in fetchEventsWithData:', err);
    }
  }, [fetchEvents, fetchEnhancedEventData]);

  // Initialize on component mount
  useEffect(() => {
    fetchEventsWithData();
  }, [fetchEventsWithData]);

  return {
    eventData,
    isLoading,
    error,
    refreshEvents: fetchEventsWithData,
  };
}
