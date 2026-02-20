import { EventType } from '@typeDefs/event';

export type ScheduleFilter = EventType | 'ALL';

export interface EventFilter {
  label: ScheduleFilter;
  color: string;
}

export const pageFilters: EventFilter[] = [
  { label: 'ALL', color: '#F3F3FC' },
  { label: 'GENERAL', color: 'rgba(158, 231, 229, 1)' },
  { label: 'ACTIVITIES', color: 'rgba(255, 197, 171, 1)' },
  { label: 'WORKSHOPS', color: 'rgba(175, 209, 87, 1)' },
  { label: 'MEALS', color: 'rgba(255, 197, 61, 1)' },
  { label: 'RECOMMENDED', color: '#BBABDD' },
];
