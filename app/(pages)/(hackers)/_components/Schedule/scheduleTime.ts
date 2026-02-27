import Event from '@typeDefs/event';

export const formatScheduleTime = (date: Date): string =>
  date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

export const formatScheduleTimeRange = (start: Date, end?: Date): string => {
  if (!end || start.getTime() === end.getTime()) {
    return formatScheduleTime(start);
  }

  const startTimeStr = formatScheduleTime(start);
  const endTimeStr = formatScheduleTime(end);

  const startAMPM = startTimeStr.slice(-2);
  const endAMPM = endTimeStr.slice(-2);

  if (startAMPM === endAMPM) {
    return `${startTimeStr.slice(0, -2)} - ${endTimeStr}`;
  }

  return `${startTimeStr} - ${endTimeStr}`;
};

export const getScheduleEventEndTime = (event: Event): Date => {
  if (event.end_time) return new Date(event.end_time);
  const fallback = new Date(event.start_time);
  fallback.setMinutes(fallback.getMinutes() + 60);
  return fallback;
};

export const isScheduleEventLive = (
  event: Event,
  now: Date = new Date()
): boolean => {
  const start = new Date(event.start_time);
  const end = getScheduleEventEndTime(event);
  return start <= now && now < end;
};

export const startsScheduleEventInNextMs = (
  event: Event,
  msFromNow: number,
  now: Date = new Date()
): boolean => {
  const start = new Date(event.start_time);
  const endWindow = new Date(now.getTime() + msFromNow);
  return start > now && start <= endWindow;
};
