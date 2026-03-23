import Event from '@typeDefs/event';

export interface EventDetails {
  event: Event;
  attendeeCount?: number;
  inPersonalSchedule?: boolean;
  isRecommended?: boolean;
}

export interface ScheduleData {
  [dayKey: string]: EventDetails[];
}

export type GroupedDayEntries = [string, EventDetails[]][];
