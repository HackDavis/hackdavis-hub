'use client';
import { useCallback, useState, useEffect } from 'react';
import { getUsersForOneEvent } from '@actions/userToEvents/getUserToEvent';

export function useEvents(eventIds: string[]) {
  const [attendeeCounts, setAttendeeCounts] = useState<Record<string, number>>(
    {}
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the number of attendees per event
  const fetchAttendeesPerEvent = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const counts: Record<string, number> = {};

      // Fetch attendees for each event ID
      for (const eventId of eventIds) {
        if (!eventId) continue;

        const result = await getUsersForOneEvent(eventId);

        if (result.ok) {
          // Create a deep copy of the response body to avoid reference issues
          const responseCopy = JSON.parse(JSON.stringify(result.body));
          counts[eventId] = responseCopy ? responseCopy.length : 0;
        } else {
          if (result.error?.includes('No matching userToEvent found')) {
            counts[eventId] = 0;
          }
        }
      }

      setAttendeeCounts(counts);
    } catch (err) {
      console.error('Error in fetchAttendeesPerEvent:', err);
      setError(
        `Error fetching attendees: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    } finally {
      setIsLoading(false);
    }
  }, [eventIds]);

  // Call fetchAttendeesPerEvent when the hook is initialized or eventIds change
  useEffect(() => {
    if (eventIds.length > 0) {
      fetchAttendeesPerEvent();
    }
  }, [eventIds, fetchAttendeesPerEvent]);

  return { attendeeCounts, isLoading, error, fetchAttendeesPerEvent };
}
