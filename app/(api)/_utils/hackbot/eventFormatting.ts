export function parseRawDate(raw: unknown): Date | null {
  let date: Date | null = null;
  if (raw instanceof Date) {
    date = raw;
  } else if (typeof raw === 'string') {
    date = new Date(raw);
  } else if (raw && typeof raw === 'object' && '$date' in (raw as any)) {
    date = new Date((raw as any).$date);
  }
  return date && !Number.isNaN(date.getTime()) ? date : null;
}

export function formatEventDateTime(raw: unknown): string | null {
  const date = parseRawDate(raw);
  if (!date) return null;
  return date.toLocaleString('en-US', {
    timeZone: 'America/Los_Angeles',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/** Returns only the time portion (e.g. "3:00 PM") — used when end is same day as start. */
export function formatEventTime(date: Date): string {
  return date.toLocaleString('en-US', {
    timeZone: 'America/Los_Angeles',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function isSameCalendarDay(a: Date, b: Date): boolean {
  const opts: Intl.DateTimeFormatOptions = { timeZone: 'America/Los_Angeles' };
  return (
    a.toLocaleDateString('en-US', opts) === b.toLocaleDateString('en-US', opts)
  );
}

/** Returns the event end time, falling back to start_time + 60 min. */
export function getEventEndTime(ev: any): Date {
  const end = parseRawDate(ev.end_time);
  const start = parseRawDate(ev.start_time);

  // Some seed records have a bad end_time year (e.g. end before start).
  // Treat those as malformed and fall back to start + 60 min.
  if (end && start && end >= start) return end;
  if (end) return end;
  if (!start) return new Date();
  const fallback = new Date(start.getTime());
  fallback.setMinutes(fallback.getMinutes() + 60);
  return fallback;
}

/** Returns "YYYY-MM-DD" in LA timezone. */
export function getLADateString(date: Date): string {
  return date.toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' });
}
