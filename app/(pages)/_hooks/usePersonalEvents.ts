'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getEventsForOneUser } from '@actions/userToEvents/getUserToEvent';
import { createUserToEvent } from '@actions/userToEvents/createUserToEvent';
import { deleteUserToEvent } from '@actions/userToEvents/deleteUserToEvent';
import { getEventsWithAttendees } from '@actions/userToEvents/getUserToEvent';
import Event from '@typeDefs/event';
import UserToEvent from '@typeDefs/userToEvent';

// Cache structure to store personal events data between component mounts
interface PersonalEventsCache {
  [userId: string]: {
    personalEvents: Event[];
    userToEvents: UserToEvent[];
    timestamp: number;
  };
}

// Create cache object outside of component to persist between navigations
const personalEventsCache: PersonalEventsCache = {};

// Cache expiration time (in milliseconds) - e.g., 5 minutes
const CACHE_EXPIRY = 5 * 60 * 1000;

export function usePersonalEvents(userId: string) {
  const [personalEvents, setPersonalEvents] = useState<Event[]>([]);
  const [userToEvents, setUserToEvents] = useState<UserToEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  // Function to automatically add General events to personal schedule
  const addGeneralEventsToPersonal = useCallback(async () => {
    if (!userId) return;

    try {
      // Get all events
      const allEventsResult = await getEventsWithAttendees();

      if (allEventsResult.ok) {
        const allEvents = allEventsResult.body;
        // Only filter for GENERAL events, not MEALS
        const generalEvents = allEvents.filter(
          (event: Event) => event.type === 'GENERAL'
        );

        // Get current personal events to know which general events are not yet added
        const currentPersonalResult = await getEventsForOneUser(userId);
        const currentEventIds = currentPersonalResult.ok
          ? currentPersonalResult.body.map((relation: any) => relation.event_id)
          : [];

        // Add each general event if not already in personal schedule
        for (const event of generalEvents) {
          if (!currentEventIds.includes(event._id)) {
            await createUserToEvent(userId, event._id);
          }
        }

        // Refresh personal events to reflect the changes
        return fetchPersonalEvents(true);
      }
    } catch (err) {
      console.error('Error adding general events to personal schedule:', err);
    }
  }, [userId]);

  // Fetch the user's events
  const fetchPersonalEvents = useCallback(
    async (forceRefresh = false) => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        // Check if we have valid cached data for this user
        const now = Date.now();
        if (
          !forceRefresh &&
          personalEventsCache[userId] &&
          now - personalEventsCache[userId].timestamp < CACHE_EXPIRY
        ) {
          // Use cached data if available and not expired
          if (isMounted.current) {
            setPersonalEvents(personalEventsCache[userId].personalEvents);
            setUserToEvents(personalEventsCache[userId].userToEvents);
            setIsLoading(false);
          }
          return;
        }

        // If no valid cache or force refresh, fetch fresh data
        setIsLoading(true);
        setError(null);
        const result = await getEventsForOneUser(userId);

        if (result.ok) {
          const userToEventsData = result.body;

          // Extract the events from the user-to-event relations if they exist
          const events = userToEventsData
            .filter(
              (relation: any) => relation.events && relation.events.length > 0
            )
            .map((relation: any) => {
              // Get the first event from the events array
              const event = relation.events[0];
              // Make sure dates are properly handled
              if (event.start_time && typeof event.start_time === 'string') {
                event.start_time = new Date(event.start_time);
              }
              if (event.end_time && typeof event.end_time === 'string') {
                event.end_time = new Date(event.end_time);
              }
              return event;
            });

          if (isMounted.current) {
            setUserToEvents(userToEventsData);
            setPersonalEvents(events);

            // Update the cache with fresh data
            personalEventsCache[userId] = {
              personalEvents: events,
              userToEvents: userToEventsData,
              timestamp: now,
            };
          }
        } else {
          // If no events found, set empty array rather than error for new users
          if (result.error?.includes('No matching userToEvent found')) {
            if (isMounted.current) {
              setUserToEvents([]);
              setPersonalEvents([]);

              // Update cache with empty data
              personalEventsCache[userId] = {
                personalEvents: [],
                userToEvents: [],
                timestamp: now,
              };
            }
          } else {
            if (isMounted.current) {
              setError(result.error || 'Failed to fetch personal events');
            }
          }
        }
      } catch (err) {
        console.error('Error in fetchPersonalEvents:', err);
        if (isMounted.current) {
          setError(
            `Error fetching personal events: ${
              err instanceof Error ? err.message : String(err)
            }`
          );
        }
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    },
    [userId]
  );

  // Add an event to the user's personal schedule
  const addToPersonalSchedule = useCallback(
    async (eventId: string) => {
      if (!userId || !eventId) return false;

      try {
        setIsLoading(true);
        setError(null);
        const result = await createUserToEvent(userId, eventId);

        if (result.ok) {
          // Force refresh the personal events after adding a new one
          await fetchPersonalEvents(true);
          return true;
        } else {
          setError(result.error || 'Failed to add event to personal schedule');
          return false;
        }
      } catch (err) {
        console.error('Error in addToPersonalSchedule:', err);
        setError(
          `Error adding event to personal schedule: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [userId, fetchPersonalEvents]
  );

  // Remove an event from the user's personal schedule
  const removeFromPersonalSchedule = useCallback(
    async (eventId: string) => {
      if (!userId || !eventId) return false;

      try {
        setIsLoading(true);
        setError(null);
        const result = await deleteUserToEvent({
          user_id: userId,
          event_id: eventId,
        });

        if (result.ok) {
          // Force refresh the personal events after removing one
          await fetchPersonalEvents(true);
          return true;
        } else {
          setError(
            result.error || 'Failed to remove event from personal schedule'
          );
          return false;
        }
      } catch (err) {
        setError(
          `Error removing event from personal schedule: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [userId, fetchPersonalEvents]
  );

  // Check if an event is in the user's personal schedule
  const isInPersonalSchedule = useCallback(
    (eventId: string): boolean => {
      return userToEvents.some((relation) => relation.event_id === eventId);
    },
    [userToEvents]
  );

  // Load personal events on component mount or when userId changes
  useEffect(() => {
    isMounted.current = true;
    fetchPersonalEvents();

    // Automatically add general events to personal schedule
    addGeneralEventsToPersonal();

    return () => {
      isMounted.current = false;
    };
  }, [fetchPersonalEvents, addGeneralEventsToPersonal]);

  // Return a refreshPersonalEvents function that forces a cache refresh
  const refreshPersonalEventsForced = useCallback(() => {
    return fetchPersonalEvents(true);
  }, [fetchPersonalEvents]);

  return {
    personalEvents,
    isLoading,
    error,
    addToPersonalSchedule,
    removeFromPersonalSchedule,
    isInPersonalSchedule,
    refreshPersonalEvents: refreshPersonalEventsForced,
    addGeneralEventsToPersonal, // Export this function to allow manual trigger if needed
  };
}
