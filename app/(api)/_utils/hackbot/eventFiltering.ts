import {
  parseRawDate,
  getEventEndTime,
  getLADateString,
} from './eventFormatting';

import type { HackerProfile } from '@typeDefs/hackbot';

export type { HackerProfile };

export const ROLE_TAGS = new Set([
  'developer',
  'designer',
  'pm',
  'beginner',
  'other',
]);

export function isEventRecommended(
  ev: any,
  profile: HackerProfile | null
): boolean {
  if (!profile) return false;
  if (!ev.tags || !Array.isArray(ev.tags)) return false;
  const tags = ev.tags.map((t: string) => t.toLowerCase());
  if (profile.position && tags.includes(profile.position.toLowerCase()))
    return true;
  if (profile.is_beginner && tags.includes('beginner')) return true;
  return false;
}

/**
 * Returns true if the event is relevant to the hacker's profile.
 * Events with no role/experience tags are considered relevant to everyone.
 * Events with specific tags are only relevant if the profile matches at least one.
 */
export function isEventRelevantToProfile(
  ev: any,
  profile: HackerProfile | null
): boolean {
  const tags: string[] = Array.isArray(ev.tags)
    ? ev.tags.map((t: string) => t.toLowerCase())
    : [];
  const roleTags = tags.filter((t) => ROLE_TAGS.has(t));
  // No role tags → relevant to everyone
  if (roleTags.length === 0) return true;
  // Has role tags → only relevant if profile matches
  if (!profile) return false;
  if (profile.position && roleTags.includes(profile.position.toLowerCase()))
    return true;
  if (profile.is_beginner && roleTags.includes('beginner')) return true;
  return false;
}

/** Returns the hour (0–23) of a Date in LA timezone. */
function getLAHour(date: Date): number {
  return parseInt(
    date.toLocaleString('en-US', {
      timeZone: 'America/Los_Angeles',
      hour: 'numeric',
      hour12: false,
    }),
    10
  );
}

/** Filters events by time relationship to "now" in LA timezone. */
export function applyTimeFilter(
  events: any[],
  filter:
    | 'today'
    | 'now'
    | 'upcoming'
    | 'past'
    | 'morning'
    | 'afternoon'
    | 'evening'
    | 'night'
): any[] {
  const now = new Date();
  const todayStr = getLADateString(now);

  switch (filter) {
    case 'today': {
      return events.filter((ev) => {
        const start = parseRawDate(ev.start_time);
        return start && getLADateString(start) === todayStr;
      });
    }
    case 'now': {
      return events.filter((ev) => {
        const start = parseRawDate(ev.start_time);
        if (!start) return false;
        const end = getEventEndTime(ev);
        return start <= now && now < end;
      });
    }
    case 'upcoming': {
      const threeHoursLater = new Date(now.getTime() + 3 * 60 * 60 * 1000);
      return events.filter((ev) => {
        const start = parseRawDate(ev.start_time);
        return start && start > now && start <= threeHoursLater;
      });
    }
    case 'past': {
      return events.filter((ev) => {
        const end = getEventEndTime(ev);
        return end <= now;
      });
    }
    // Time-of-day filters (match on start_time hour in LA timezone)
    case 'morning': {
      // 6 AM – 11:59 AM
      return events.filter((ev) => {
        const start = parseRawDate(ev.start_time);
        if (!start) return false;
        const h = getLAHour(start);
        return h >= 6 && h < 12;
      });
    }
    case 'afternoon': {
      // 12 PM – 4:59 PM
      return events.filter((ev) => {
        const start = parseRawDate(ev.start_time);
        if (!start) return false;
        const h = getLAHour(start);
        return h >= 12 && h < 17;
      });
    }
    case 'evening': {
      // 5 PM – 8:59 PM
      return events.filter((ev) => {
        const start = parseRawDate(ev.start_time);
        if (!start) return false;
        const h = getLAHour(start);
        return h >= 17 && h < 21;
      });
    }
    case 'night': {
      // 9 PM – 5:59 AM (late night / overnight)
      return events.filter((ev) => {
        const start = parseRawDate(ev.start_time);
        if (!start) return false;
        const h = getLAHour(start);
        return h >= 21 || h < 6;
      });
    }
    default:
      return events;
  }
}
