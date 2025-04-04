'use client';

import { useState, useEffect, useCallback } from 'react';
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

export function usePersonalEvents(userId: string) {
  const [personalEvents, setPersonalEvents] = useState<Event[]>([]);
  const [userToEventRelations, setUserToEventRelations] = useState<
    UserToEventRelation[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the user's events
  const fetchPersonalEvents = useCallback(async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      setError(null);
      const result = await getEventsForOneUser(userId);

      if (result.ok) {
        setUserToEventRelations(result.body);

        // Extract the events from the user-to-event relations if they exist
        const events = result.body
          .filter((relation: UserToEventRelation) => relation.event)
          .map((relation: UserToEventRelation) => relation.event as Event);

        setPersonalEvents(events);
      } else {
        setError(result.error || 'Failed to fetch personal events');
      }
    } catch (err) {
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

  // Check if an event is in the user's personal schedule
  const isInPersonalSchedule = useCallback(
    (eventId: string): boolean => {
      return userToEventRelations.some(
        (relation) => relation.event_id === eventId
      );
    },
    [userToEventRelations]
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
