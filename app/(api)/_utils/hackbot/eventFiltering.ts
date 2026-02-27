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

/** Filters events by time relationship to "now" in LA timezone. */
export function applyTimeFilter(
  events: any[],
  filter: 'today' | 'now' | 'upcoming' | 'past'
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
    default:
      return events;
  }
}
