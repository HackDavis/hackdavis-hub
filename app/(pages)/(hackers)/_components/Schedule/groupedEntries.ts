import { ScheduleFilter } from '@typeDefs/filters';
import { DAY_KEYS, DayKey } from './constants';
import {
  EventDetails,
  GroupedDayEntries,
  ScheduleData,
} from '@typeDefs/schedule';

export const getGroupedEntriesForDay = (
  dayKey: DayKey,
  dataToUse: ScheduleData | null,
  activeFilters: ScheduleFilter[]
): GroupedDayEntries => {
  const eventsForDay = dataToUse?.[dayKey] ?? [];
  let filteredEvents = eventsForDay;

  if (activeFilters.length > 0 && !activeFilters.includes('ALL')) {
    filteredEvents = eventsForDay.filter((eventDetail) => {
      if (activeFilters.includes('RECOMMENDED') && eventDetail.isRecommended) {
        return true;
      }

      return activeFilters.includes(eventDetail.event.type);
    });
  }

  if (filteredEvents.length === 0) return [];

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const startA = new Date(a.event.start_time).getTime();
    const startB = new Date(b.event.start_time).getTime();

    if (startA !== startB) {
      return startA - startB;
    }

    const endA = a.event.end_time ? new Date(a.event.end_time).getTime() : null;
    const endB = b.event.end_time ? new Date(b.event.end_time).getTime() : null;

    if (endA === null && endB !== null) return -1;
    if (endA !== null && endB === null) return 1;

    // Make sure events without end time populate first (ex: check in events)
    if (endA !== null && endB !== null) {
      return endA - endB;
    }

    return 0;
  });

  const groups = sortedEvents.reduce(
    (acc: Record<string, EventDetails[]>, eventDetails) => {
      const localizedStart = new Date(
        eventDetails.event.start_time.toLocaleString('en-US', {
          timeZone: 'America/Los_Angeles',
        })
      );

      const timeKey = localizedStart.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });

      if (!acc[timeKey]) {
        acc[timeKey] = [];
      }

      acc[timeKey].push(eventDetails);
      return acc;
    },
    {}
  );

  return Object.entries(groups).sort((a, b) => {
    const dummyDay = '01/01/2000';
    const dateA = new Date(`${dummyDay} ${a[0]}`);
    const dateB = new Date(`${dummyDay} ${b[0]}`);
    return dateA.getTime() - dateB.getTime();
  });
};

export const buildGroupedEntriesByDay = (
  dataToUse: ScheduleData | null,
  activeFilters: ScheduleFilter[]
): Record<DayKey, GroupedDayEntries> => {
  return DAY_KEYS.reduce(
    (acc, dayKey) => {
      acc[dayKey] = getGroupedEntriesForDay(dayKey, dataToUse, activeFilters);
      return acc;
    },
    {} as Record<DayKey, GroupedDayEntries>
  );
};
