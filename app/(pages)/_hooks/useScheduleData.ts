'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import useActiveUser from '@pages/_hooks/useActiveUser';
import { useEvents } from '@hooks/useEvents';
import { usePersonalEvents } from '@hooks/usePersonalEvents';
import { ScheduleFilter } from '@typeDefs/filters';
import { DAY_KEYS, DayKey } from '../(hackers)/_components/Schedule/constants';
import { buildGroupedEntriesByDay } from '../(hackers)/_components/Schedule/groupedEntries';
import { ScheduleData } from '@typeDefs/schedule';
import { useActiveDaySync } from './useActiveDaySync';

interface UseScheduleDataResult {
  activeTab: 'schedule' | 'personal';
  setActiveTab: Dispatch<SetStateAction<'schedule' | 'personal'>>;
  activeDay: DayKey;
  setActiveDay: Dispatch<SetStateAction<DayKey>>;
  activeFilters: ScheduleFilter[];
  toggleFilter: (label: ScheduleFilter) => void;
  isMobileFilterOpen: boolean;
  setIsMobileFilterOpen: (
    value: boolean | ((prev: boolean) => boolean)
  ) => void;
  groupedEntriesByDay: ReturnType<typeof buildGroupedEntriesByDay>;
  handleAddToSchedule: (eventId: string) => Promise<void>;
  handleRemoveFromSchedule: (eventId: string) => Promise<void>;
  isInitialLoad: boolean;
  isError: boolean;
  changeActiveDay: (day: DayKey) => void;
}

const getDayKeyInPacific = (date: Date) =>
  date.toLocaleString('en-US', {
    timeZone: 'America/Los_Angeles',
    day: 'numeric',
  });

export function useScheduleData(): UseScheduleDataResult {
  const { user, loading: userLoading } = useActiveUser('/');

  const {
    eventData,
    isLoading: eventsLoading,
    error: eventsError,
    refreshEvents,
  } = useEvents(user);

  const {
    personalEvents,
    isLoading: personalEventsLoading,
    error: personalEventsError,
    addToPersonalSchedule,
    removeFromPersonalSchedule,
    isInPersonalSchedule,
    refreshPersonalEvents,
  } = usePersonalEvents(user?._id || '');

  const [activeTab, setActiveTab] = useState<'schedule' | 'personal'>(
    'schedule'
  );
  const [activeDay, setActiveDay] = useState<DayKey>('9');
  const [activeFilters, setActiveFilters] = useState<ScheduleFilter[]>(['ALL']);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);

  const patchScheduleMembership = (
    eventId: string,
    inPersonalSchedule: boolean
  ) => {
    setScheduleData((prev) => {
      if (!prev) return prev;

      const next = { ...prev };
      Object.keys(next).forEach((dayKey) => {
        next[dayKey] = next[dayKey].map((item) => {
          if (item.event._id === eventId) {
            return { ...item, inPersonalSchedule };
          }
          return item;
        });
      });

      return next;
    });
  };

  const handleAddToSchedule = async (eventId: string) => {
    const success = await addToPersonalSchedule(eventId);

    if (success) {
      await refreshPersonalEvents();
      await refreshEvents();

      if (activeTab === 'schedule') {
        patchScheduleMembership(eventId, true);
      }
    }
  };

  const handleRemoveFromSchedule = async (eventId: string) => {
    const success = await removeFromPersonalSchedule(eventId);

    if (success) {
      await refreshPersonalEvents();
      await refreshEvents();

      if (activeTab === 'schedule') {
        patchScheduleMembership(eventId, false);
      }
    }
  };

  useEffect(() => {
    if (user && !userLoading) {
      refreshEvents();
    }
  }, [user, userLoading, refreshEvents]);

  useEffect(() => {
    if (!eventsLoading && !personalEventsLoading) {
      const groupedByDay = eventData.reduce(
        (acc: ScheduleData, eventWithCount) => {
          const event = eventWithCount.event;
          const dayKey = getDayKeyInPacific(event.start_time);

          if (!acc[dayKey]) {
            acc[dayKey] = [];
          }

          const isPersonal = isInPersonalSchedule(event._id || '');

          acc[dayKey].push({
            event,
            attendeeCount: eventWithCount.attendeeCount,
            inPersonalSchedule: isPersonal,
            isRecommended: eventWithCount.isRecommended,
          });
          return acc;
        },
        {}
      );

      setScheduleData(groupedByDay);
    }
  }, [
    eventData,
    personalEvents,
    isInPersonalSchedule,
    personalEventsLoading,
    eventsLoading,
  ]);

  useEffect(() => {
    if (activeTab === 'personal') {
      refreshPersonalEvents();
    }
  }, [activeTab, refreshPersonalEvents]);

  const personalScheduleData = useMemo(() => {
    if (!personalEvents?.length) return {};

    const groupedByDay = personalEvents.reduce((acc: ScheduleData, event) => {
      const dayKey = getDayKeyInPacific(event.start_time);
      if (!acc[dayKey]) {
        acc[dayKey] = [];
      }

      const eventWithCount = eventData.find((e) => e.event._id === event._id);

      acc[dayKey].push({
        event,
        attendeeCount: eventWithCount?.attendeeCount || 0,
        inPersonalSchedule: true,
        isRecommended: eventWithCount?.isRecommended || false,
      });
      return acc;
    }, {});

    return groupedByDay;
  }, [personalEvents, eventData]);

  const dataToUse =
    activeTab === 'personal' ? personalScheduleData : scheduleData;

  const groupedEntriesByDay = useMemo(
    () => buildGroupedEntriesByDay(dataToUse, activeFilters),
    [dataToUse, activeFilters]
  );

  const syncSignal = useMemo(() => {
    const contentHash = DAY_KEYS.map((dayKey) => {
      const dayGroups = groupedEntriesByDay[dayKey] || [];
      const totalEvents = dayGroups.reduce(
        (sum, group) => sum + group.entries.length,
        0
      );
      return `${dayGroups.length}-${totalEvents}`;
    }).join(',');
    return `${activeTab}:${activeFilters.join(',')}:${contentHash}`;
  }, [activeTab, activeFilters, groupedEntriesByDay]);

  const { changeActiveDay } = useActiveDaySync({
    activeDay,
    setActiveDay,
    dayKeys: DAY_KEYS,
    syncSignal,
  });

  const toggleFilter = (label: ScheduleFilter) => {
    if (label === 'ALL') {
      setActiveFilters(['ALL']);
      return;
    }

    const withoutAll = activeFilters.filter((id) => id !== 'ALL');

    if (withoutAll.includes(label)) {
      const nextFilters = withoutAll.filter((id) => id !== label);
      setActiveFilters(nextFilters.length > 0 ? nextFilters : ['ALL']);
      return;
    }

    setActiveFilters([...withoutAll, label]);
  };

  const isInitialLoad = userLoading; // only show loading state for inital rendering bc eventsLoading/personalEventsLoading causes non ui-friendly refresh
  const isError = Boolean(personalEventsError || eventsError);

  return {
    activeTab,
    setActiveTab,
    activeDay,
    setActiveDay,
    activeFilters,
    toggleFilter,
    isMobileFilterOpen,
    setIsMobileFilterOpen,
    groupedEntriesByDay,
    handleAddToSchedule,
    handleRemoveFromSchedule,
    isInitialLoad,
    isError,
    changeActiveDay,
  };
}
