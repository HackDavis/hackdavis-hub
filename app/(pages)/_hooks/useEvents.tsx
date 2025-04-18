'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getEventsWithAttendees } from '@actions/userToEvents/getUserToEvent';
import Event, { EventTag } from '@typeDefs/event';
import User from '@typeDefs/user';

export interface EventData {
  event: Event;
  attendeeCount: number;
  isRecommended?: boolean;
}

// Add a cache to store events data between component mounts
const eventsCache: {
  data: EventData[] | null;
  timestamp: number | null;
} = {
  data: null,
  timestamp: null,
};

// Cache expiration time (in milliseconds) - e.g., 5 minutes
const CACHE_EXPIRY = 5 * 60 * 1000;

export function useEvents(currentUser?: User | null) {
  const [eventData, setEventData] = useState<EventData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  // Combined function to fetch events with attendee counts in a single request
  const fetchEventsWithData = useCallback(
    async (forceRefresh = false) => {
      try {
        // Check cache first (same as before)
        const now = Date.now();
        if (
          !forceRefresh &&
          eventsCache.data &&
          eventsCache.timestamp &&
          now - eventsCache.timestamp < CACHE_EXPIRY
        ) {
          setEventData(eventsCache.data);
          setIsLoading(false);
          return;
        }

        // Make a single API call to get events with attendee counts
        setIsLoading(true);
        const response = await getEventsWithAttendees();

        if (response.ok) {
          // Process the results
          const enhancedEvents = response.body.map((event: any) => {
            // Ensure dates are properly parsed
            if (event.start_time && typeof event.start_time === 'string') {
              event.start_time = new Date(event.start_time);
            }
            if (event.end_time && typeof event.end_time === 'string') {
              event.end_time = new Date(event.end_time);
            }

            // Check if recommended for current user
            const isRecommended = checkIfRecommended(event, currentUser);

            return {
              event,
              attendeeCount: event.attendeeCount || 0,
              isRecommended,
            };
          });

          if (isMounted.current) {
            setEventData(enhancedEvents);

            // Update cache
            eventsCache.data = enhancedEvents;
            eventsCache.timestamp = now;

            setIsLoading(false);
          }
        } else {
          if (isMounted.current) {
            setError(response.error || 'Failed to fetch events');
            setIsLoading(false);
          }
        }
      } catch (err) {
        console.error('Error in fetchEventsWithData:', err);
        if (isMounted.current) {
          setError(
            `Error fetching events: ${
              err instanceof Error ? err.message : String(err)
            }`
          );
          setIsLoading(false);
        }
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

  // Initialize on component mount
  useEffect(() => {
    isMounted.current = true;
    fetchEventsWithData();

    return () => {
      isMounted.current = false;
    };
  }, [fetchEventsWithData]);

  // Force refresh function
  const refreshEvents = useCallback(() => {
    return fetchEventsWithData(true);
  }, [fetchEventsWithData]);

  return {
    eventData,
    isLoading,
    error,
    refreshEvents,
  };
}
