'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getEventsForOneUser } from '@actions/userToEvents/getUserToEvent';
import { createUserToEvent } from '@actions/userToEvents/createUserToEvent';
import { deleteUserToEvent } from '@actions/userToEvents/deleteUserToEvent';
import Event from '@typeDefs/event';

interface UserToEventRelation {
  _id: string;
  user_id: string;
  event_id: string;
  event?: Event;
}

interface usePersonalEventsProps {
  userId: string;
}

export function usePersonalEvents({ userId }: usePersonalEventsProps) {
  const [personalEvents, setPersonalEvents] = useState<Event[]>([]);
  const [userToEventRelations, setUserToEventRelations] = useState<
    UserToEventRelation[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the user's events
  const fetchPersonalEvents = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const result = await getEventsForOneUser(userId);

      if (result.ok) {
        // Create a new array instead of directly modifying the result.body
        const relationsCopy = JSON.parse(JSON.stringify(result.body));
        setUserToEventRelations(relationsCopy);

        // Extract the events from the user-to-event relations if they exist
        const events = relationsCopy
          .filter(
            (relation: any) => relation.events && relation.events.length > 0
          )
          .map((relation: any) => {
            // Create a new event object from the first event in the events array
            const event = { ...relation.events[0] };
            // const attendeeCount = relation.events[0].
            if (event.start_time && typeof event.start_time === 'string') {
              event.start_time = new Date(event.start_time);
            }
            if (event.end_time && typeof event.end_time === 'string') {
              event.end_time = new Date(event.end_time);
            }
            return event;
          });

        setPersonalEvents(events);
      } else {
        // If no events found, set empty array rather than error for new users
        if (result.error?.includes('No matching userToEvent found')) {
          setUserToEventRelations([]);
          setPersonalEvents([]);
        } else {
          setError(result.error || 'Failed to fetch personal events');
        }
      }
    } catch (err) {
      console.error('Error in fetchPersonalEvents:', err);
      setError(
        `Error fetching personal events: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Add an event to the user's personal schedule
  const addToPersonalSchedule = useCallback(
    async (eventId: string) => {
      if (!userId || !eventId) return false;

      try {
        setIsLoading(true);
        setError(null);
        const result = await createUserToEvent(userId, eventId);

        if (result.ok) {
          // Refresh the personal events after adding a new one
          await fetchPersonalEvents();
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
          // Refresh the personal events after removing one
          await fetchPersonalEvents();
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
  // Instead of recomputing on every userToEventRelations change, use a ref
  // to break the dependency cycle
  const userToEventRelationsRef = useRef(userToEventRelations);
  useEffect(() => {
    userToEventRelationsRef.current = userToEventRelations;
  }, [userToEventRelations]);

  // Check if an event is in the user's personal schedule
  const isInPersonalSchedule = useCallback(
    (eventId: string): boolean => {
      return userToEventRelationsRef.current.some(
        (relation) => relation.event_id === eventId
      );
    },
    [] // Empty dependency array to prevent recreation
  );

  // Load personal events on component mount or when userId changes
  useEffect(() => {
    fetchPersonalEvents();
  }, [fetchPersonalEvents]);

  return {
    personalEvents,
    isLoading,
    error,
    addToPersonalSchedule,
    removeFromPersonalSchedule,
    isInPersonalSchedule,
    refreshPersonalEvents: fetchPersonalEvents,
  };
}
