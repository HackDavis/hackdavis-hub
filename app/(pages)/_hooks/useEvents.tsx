"use client";

import { useState, useEffect, useCallback } from "react";
import { getEvents } from "@actions/events/getEvent";
import { getUsersForOneEvent } from "@actions/userToEvents/getUserToEvent";
import Event from "@typeDefs/event";

export interface EventWithAttendeeCount {
  event: Event;
  attendeeCount: number;
}

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventsWithAttendeeCount, setEventsWithAttendeeCount] = useState<
    EventWithAttendeeCount[]
  >([]);
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
          if (event.start_time && typeof event.start_time === "string") {
            event.start_time = new Date(event.start_time);
          }
          if (event.end_time && typeof event.end_time === "string") {
            event.end_time = new Date(event.end_time);
          }
          return event;
        });

        setEvents(fetchedEvents);
        return fetchedEvents;
      } else {
        setError(response.error || "Failed to fetch events");
        return [];
      }
    } catch (err) {
      console.error("Error in fetchEvents:", err);
      setError(
        `Error fetching events: ${
          err instanceof Error ? err.message : String(err)
        }`,
      );
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch attendee count for all events
  const fetchAttendeeCount = useCallback(async (eventsList: Event[]) => {
    try {
      setIsLoading(true);

      // Process events in parallel for efficiency
      const eventsWithCount = await Promise.all(
        eventsList.map(async (event) => {
          if (!event._id) return { event, attendeeCount: 0 };

          try {
            const result = await getUsersForOneEvent(event._id);
            const attendeeCount = result.ok ? result.body.length : 0;
            return { event, attendeeCount };
          } catch (err) {
            console.error(
              `Error fetching attendees for event ${event._id}:`,
              err,
            );
            return { event, attendeeCount: 0 };
          }
        }),
      );

      setEventsWithAttendeeCount(eventsWithCount);
    } catch (err) {
      console.error("Error in fetchAttendeeCount:", err);
      setError(
        `Error fetching attendee counts: ${
          err instanceof Error ? err.message : String(err)
        }`,
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Combined function to fetch events and their attendee counts
  const fetchEventsWithAttendeeCount = useCallback(async () => {
    try {
      const fetchedEvents = await fetchEvents();
      if (fetchedEvents.length > 0) {
        await fetchAttendeeCount(fetchedEvents);
      }
    } catch (err) {
      console.error("Error in fetchEventsWithAttendeeCount:", err);
    }
  }, [fetchEvents, fetchAttendeeCount]);

  // Initialize on component mount
  useEffect(() => {
    fetchEventsWithAttendeeCount();
  }, [fetchEventsWithAttendeeCount]);

  return {
    events,
    eventsWithAttendeeCount,
    isLoading,
    error,
    refreshEvents: fetchEventsWithAttendeeCount,
  };
}
