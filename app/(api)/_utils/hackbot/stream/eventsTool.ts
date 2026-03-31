import { z } from 'zod';
import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import {
  parseRawDate,
  formatEventDateTime,
  formatEventTime,
  getLADateString,
  getEventEndTime,
} from '@utils/hackbot/eventFormatting';
import {
  isEventRecommended,
  isEventRelevantToProfile,
  applyTimeFilter,
} from '@utils/hackbot/eventFiltering';
import type { HackerProfile } from '@typeDefs/hackbot';

const EXCLUSIVE_ROLE_TAGS = new Set(['developer', 'designer', 'pm']);

export const GET_EVENTS_INPUT_SCHEMA = z.object({
  type: z
    .string()
    .nullable()
    .describe(
      'Filter by event type: WORKSHOPS, MEALS, ACTIVITIES, or GENERAL. Pass null to include all types.'
    ),
  search: z
    .string()
    .nullable()
    .describe(
      'Case-insensitive text search on event name and description (e.g. "dinner", "opening ceremony", "team"). Pass null for no search filter. For broad queries (e.g. "workshops"), use the type filter instead — search is for specific keywords.'
    ),
  limit: z
    .number()
    .nullable()
    .describe(
      'Max number of events to return — use when only 1-3 results are expected. Pass null for no limit.'
    ),
  forProfile: z
    .boolean()
    .nullable()
    .describe(
      "When true, filters results to only events relevant to the logged-in hacker's own role/experience. Use ONLY when the user is asking about their own events ('what should I attend?'). Do NOT use when asking about a different role (use the tags filter instead). Pass null to skip."
    ),
  timeFilter: z
    .enum([
      'today',
      'now',
      'upcoming',
      'past',
      'morning',
      'afternoon',
      'evening',
      'night',
    ])
    .nullable()
    .describe(
      'Filter events by time: "today" = starts today, "now" = currently live, "upcoming" = starts within 3 hours, "past" = already ended. Time-of-day (LA timezone): "morning" = 6 AM-noon, "afternoon" = noon-5 PM, "evening" = 5-9 PM, "night" = 9 PM-6 AM. Pass null for no time filter.'
    ),
  include_activities: z
    .boolean()
    .nullable()
    .describe(
      'Allow ACTIVITIES-type events in results. Set to true ONLY when the user is explicitly asking about social/fun activities to attend. NEVER set this for prize track questions, knowledge questions, or workshop queries. Pass null or false otherwise.'
    ),
  tags: z
    .array(z.string())
    .nullable()
    .describe(
      'Filter events that have ALL of the specified tags (e.g. ["designer"] to find designer-tagged workshops, ["beginner"] for beginner events). Use this when the user asks about role-specific workshops for a role that may differ from their own profile. Pass null for no tag filter.'
    ),
  date: z
    .string()
    .nullable()
    .describe(
      'Filter events starting on a specific date (YYYY-MM-DD in LA timezone). Use for date-specific queries ("second day", "Sunday", "May 10"). Compute the date from the current time context in the system prompt. Pass null for no date filter.'
    ),
});

export type GetEventsInput = z.infer<typeof GET_EVENTS_INPUT_SCHEMA>;

export async function executeGetEvents(
  input: GetEventsInput,
  profile: HackerProfile | null
) {
  const {
    type,
    search,
    limit,
    forProfile,
    timeFilter,
    include_activities,
    tags,
    date,
  } = input;

  console.log('[hackbot][stream][tool] get_events input', {
    type,
    search,
    limit,
    forProfile,
    timeFilter,
    include_activities,
    tags,
    date,
  });

  try {
    const db = await getDatabase();
    const query: Record<string, unknown> = {};

    if (type) query.type = { $regex: type, $options: 'i' };
    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      query.$or = [{ name: searchRegex }, { description: searchRegex }];
    }
    if (tags && tags.length > 0)
      query.tags = { $all: tags.map((t) => t.toLowerCase()) };

    const events = await db
      .collection('events')
      .find(query)
      .sort({ start_time: 1 })
      .toArray();

    if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return {
        events: [],
        message: 'Invalid date format. Use YYYY-MM-DD.',
      };
    }

    const dateFiltered = date
      ? events.filter((ev: any) => {
          const start = parseRawDate(ev.start_time);
          return start && getLADateString(start) === date;
        })
      : events;

    const typeFiltered = include_activities
      ? dateFiltered
      : dateFiltered.filter(
          (ev: any) => (ev.type ?? '').toUpperCase() !== 'ACTIVITIES'
        );

    const requestedExclusive = (tags ?? [])
      .map((t) => t.toLowerCase())
      .filter((t) => EXCLUSIVE_ROLE_TAGS.has(t));
    const roleSpecificFiltered =
      requestedExclusive.length > 0
        ? typeFiltered.filter((ev: any) => {
            const evTags = (ev.tags ?? []).map((t: string) => t.toLowerCase());
            return !evTags.some(
              (t: string) =>
                EXCLUSIVE_ROLE_TAGS.has(t) && !requestedExclusive.includes(t)
            );
          })
        : typeFiltered;

    const timeFiltered = timeFilter
      ? applyTimeFilter(roleSpecificFiltered, timeFilter)
      : roleSpecificFiltered;

    const now = new Date();
    const futureFiltered =
      timeFilter === 'past'
        ? timeFiltered
        : timeFiltered.filter((ev: any) => {
            const end = getEventEndTime(ev);
            return end > now;
          });

    const profileFiltered =
      forProfile && profile
        ? futureFiltered.filter((ev: any) => isEventRelevantToProfile(ev, profile))
        : futureFiltered;

    const limited = limit ? profileFiltered.slice(0, limit) : profileFiltered;

    console.log('[hackbot][stream][tool] get_events counts', {
      total: events.length,
      afterDate: dateFiltered.length,
      afterType: typeFiltered.length,
      afterRole: roleSpecificFiltered.length,
      afterTime: timeFiltered.length,
      afterFuture: futureFiltered.length,
      afterProfile: profileFiltered.length,
      afterLimit: limited.length,
    });

    if (!limited.length) {
      return { events: [], message: 'No events found.' };
    }

    const formatted = limited.map((ev: any) => {
      const startDate = parseRawDate(ev.start_time);
      const endDate = parseRawDate(ev.end_time);
      const endFormatted = endDate ? formatEventTime(endDate) : null;
      return {
        id: String(ev._id),
        name: String(ev.name || 'Event'),
        type: ev.type || null,
        start: startDate ? formatEventDateTime(ev.start_time) : null,
        end: endFormatted,
        startMs: startDate?.getTime() ?? null,
        location: ev.location || null,
        host: ev.host || null,
        tags: Array.isArray(ev.tags) ? ev.tags : [],
        isRecommended: isEventRecommended(ev, profile),
        compact: /^(GENERAL|MEALS)$/i.test(ev.type ?? ''),
      };
    });

    console.log(
      `[hackbot][stream][tool] get_events returned ${formatted.length} events`
    );
    return { events: formatted };
  } catch (e) {
    console.error('[hackbot][stream][tool] get_events error', e);
    return {
      events: [],
      message: 'Could not fetch events. Please check the schedule page.',
    };
  }
}
