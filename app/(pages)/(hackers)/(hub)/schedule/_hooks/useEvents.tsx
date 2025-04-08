'use client';
import { useCallback, useState, useEffect } from 'react';
import { getUsersForOneEvent } from '@actions/userToEvents/getUserToEvent';

export function useEvents(event_id: string) {
  const [personalEvents, setPersonalEvents] = useState<Event[]>([]);
  const [attendeeCount, setAttendeeCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the number of attendees per event
  const fetchAttendeesPerEvent = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await getUsersForOneEvent(event_id);
      console.log('API response for attendees:', result);

      if (result.ok) {
        // Count the number of user-to-event relations for this event
        const count = result.body ? result.body.length : 0;
        console.log(`Number of attendees for event ${event_id}: ${count}`);
        setAttendeeCount(count);
      } else {
        // If no attendees found, set count to 0
        if (result.error?.includes('No matching userToEvent found')) {
          setAttendeeCount(0);
        } else {
          setError(result.error || 'Failed to fetch attendees');
        }
      }
    } catch (err) {
      console.error('Error in fetchAttendeesPerEvent:', err);
      setError(
        `Error fetching attendees: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
      // Set count to 0 in case of error
      setAttendeeCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [event_id]);

  // Call fetchAttendeesPerEvent when the hook is initialized or event_id changes
  useEffect(() => {
    if (event_id) {
      fetchAttendeesPerEvent();
    }
  }, [event_id, fetchAttendeesPerEvent]);

  return { attendeeCount, isLoading, error, fetchAttendeesPerEvent };
}
