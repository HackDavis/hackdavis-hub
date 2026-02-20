'use client';
import { useState, useEffect, useMemo } from 'react';
import CalendarItem from '../../_components/Schedule/CalendarItem';
import Loader from '@components/Loader/Loader';
import Footer from '@components/Footer/Footer';
import Image from 'next/image';
import headerGrass from '@public/hackers/schedule/header_grass.svg';
import Event from '@typeDefs/event';
import { ScheduleFilter } from '@typeDefs/filters';
import { Button } from '@pages/_globals/components/ui/button';
import Filters from '@pages/(hackers)/_components/Schedule/Filters';
import ScheduleMobileControls from '@pages/(hackers)/_components/Schedule/ScheduleMobileControls';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@globals/components/ui/tooltip';
import TooltipCow from '@public/index/schedule/vocal_angel_cow.svg';
import useActiveUser from '@pages/_hooks/useActiveUser';
import { usePersonalEvents } from '@hooks/usePersonalEvents';
import { useEvents } from '@hooks/useEvents';

export interface EventDetails {
  event: Event;
  attendeeCount?: number;
  inPersonalSchedule?: boolean;
  isRecommended?: boolean;
}

interface ScheduleData {
  [dayKey: string]: EventDetails[];
}

export default function Page() {
  const { user, loading: userLoading } = useActiveUser('/');

  // Pass the user to useEvents
  const {
    eventData,
    isLoading: eventsLoading,
    error: eventsError,
    refreshEvents,
  } = useEvents(user);

  const [activeTab, setActiveTab] = useState<'schedule' | 'personal'>(
    'schedule'
  );
  const [activeDay, setActiveDay] = useState<'9' | '10'>('9');
  const [activeFilters, setActiveFilters] = useState<ScheduleFilter[]>(['ALL']);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);
  const [isActionInProgress, setIsActionInProgress] = useState(false);

  const changeActiveDay = (day: '9' | '10') => {
    setActiveDay(day);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const {
    personalEvents,
    isLoading: personalEventsLoading,
    error: personalEventsError,
    addToPersonalSchedule,
    removeFromPersonalSchedule,
    isInPersonalSchedule,
    refreshPersonalEvents,
  } = usePersonalEvents(user?._id || '');

  // Function to handle adding to personal schedule with loading state
  const handleAddToSchedule = async (eventId: string) => {
    setIsActionInProgress(true);
    const success = await addToPersonalSchedule(eventId);

    if (success) {
      // If successful, update both tabs
      await refreshPersonalEvents();
      await refreshEvents();

      // Also update the main schedule data if we're on the schedule tab
      if (activeTab === 'schedule') {
        // Update the schedule data to reflect the change
        if (scheduleData) {
          const newScheduleData = { ...scheduleData };

          // Mark the event as in personal schedule
          Object.keys(newScheduleData).forEach((dayKey) => {
            newScheduleData[dayKey] = newScheduleData[dayKey].map((item) => {
              if (item.event._id === eventId) {
                return { ...item, inPersonalSchedule: true };
              }
              return item;
            });
          });

          setScheduleData(newScheduleData);
        }
      }
    }

    setIsActionInProgress(false);
  };

  // Function to handle removing from personal schedule with loading state
  const handleRemoveFromSchedule = async (eventId: string) => {
    setIsActionInProgress(true);
    const success = await removeFromPersonalSchedule(eventId);

    if (success) {
      // If successful, update both tabs
      await refreshPersonalEvents();
      await refreshEvents();

      // Also update the main schedule data if we're on the schedule tab
      if (activeTab === 'schedule') {
        // Update the schedule data to reflect the change
        if (scheduleData) {
          const newScheduleData = { ...scheduleData };

          // Mark the event as not in personal schedule
          Object.keys(newScheduleData).forEach((dayKey) => {
            newScheduleData[dayKey] = newScheduleData[dayKey].map((item) => {
              if (item.event._id === eventId) {
                return { ...item, inPersonalSchedule: false };
              }
              return item;
            });
          });

          setScheduleData(newScheduleData);
        }
      }
    }

    setIsActionInProgress(false);
  };

  // Force refresh events when user data changes
  useEffect(() => {
    if (user && !userLoading) {
      refreshEvents();
    }
  }, [user, userLoading, refreshEvents]);

  // Update the existing useEffect - simplify to just set the schedule data without virtual events
  useEffect(() => {
    if (!eventsLoading && !personalEventsLoading) {
      // Group events by day key - "19" or "20".
      const groupedByDay = eventData.reduce(
        (acc: ScheduleData, eventWithCount) => {
          const event = eventWithCount.event;
          const dayKey = event.start_time.toLocaleString('en-US', {
            timeZone: 'America/Los_Angeles',
            day: 'numeric',
          });
          if (!acc[dayKey]) {
            acc[dayKey] = [];
          }

          // Check if this event is in the user's personal schedule
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

  // Format personal events data
  const personalScheduleData = useMemo(() => {
    // Return empty object instead of null to avoid loading state
    if (!personalEvents?.length) return {};

    const groupedByDay = personalEvents.reduce((acc: ScheduleData, event) => {
      const dayKey = event.start_time.toLocaleString('en-US', {
        timeZone: 'America/Los_Angeles',
        day: 'numeric',
      });
      if (!acc[dayKey]) {
        acc[dayKey] = [];
      }

      // Find the attendee count for this event from eventData
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

  // Update the filtering logic to handle recommended events correctly
  const sortedGroupedEntries = useMemo(() => {
    if (!dataToUse) return [];

    // Filter events for the active day
    const eventsForDay = dataToUse[activeDay] || [];

    // Apply filter logic
    let filteredEvents = eventsForDay;

    if (activeFilters.length > 0 && !activeFilters.includes('ALL')) {
      filteredEvents = eventsForDay.filter((eventDetail) => {
        // Special handling for RECOMMENDED filter
        if (activeFilters.includes('RECOMMENDED')) {
          // If user wants recommended events and this one is recommended, include it
          if (eventDetail.isRecommended) {
            return true;
          }
        }

        // Regular type filtering for other filters
        return activeFilters.includes(eventDetail.event.type);
      });
    }

    // If no events found after filtering, return empty array
    if (filteredEvents.length === 0) return [];

    // Sort the filtered events by start time.
    const sortedEvents = [...filteredEvents].sort(
      (a, b) =>
        new Date(a.event.start_time).getTime() -
        new Date(b.event.start_time).getTime()
    );

    // Group events by their start time (converted to PDT).
    const groups = sortedEvents.reduce(
      (acc: { [key: string]: EventDetails[] }, ed) => {
        const pstDate = new Date(
          ed.event.start_time.toLocaleString('en-US', {
            timeZone: 'America/Los_Angeles',
          })
        );
        const timeKey = pstDate.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });
        if (!acc[timeKey]) {
          acc[timeKey] = [];
        }
        acc[timeKey].push(ed);
        return acc;
      },
      {}
    );

    // Sort the grouped entries by time.
    return Object.entries(groups).sort((a, b) => {
      const dummyDay = '01/01/2000';
      const dateA = new Date(`${dummyDay} ${a[0]}`);
      const dateB = new Date(`${dummyDay} ${b[0]}`);
      return dateA.getTime() - dateB.getTime();
    });
  }, [dataToUse, activeDay, activeFilters]);

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

  // Update the loading state to include eventsLoading
  const isLoading =
    userLoading || personalEventsLoading || eventsLoading || isActionInProgress;

  const isError = personalEventsError || eventsError;

  // Determine if we're in a loading state
  if (isLoading)
    return (
      <main id="schedule" className="w-full">
        <Loader />
      </main>
    );

  if (isError)
    return (
      <main
        id="schedule"
        className="w-full h-screen flex items-center justify-center"
      >
        Oops, an error occured!
      </main>
    );

  return (
    <main id="schedule" className="w-full">
      <div className="absolute aspect-[380/75] lg:aspect-[1583/351] w-full top-[calc(-1*100vw*11/375)] lg:top-[calc(-1*100vw*10/1440)] z-0 overflow-x-clip pointer-events-none">
        <Image
          src={headerGrass}
          alt="header-grass"
          className="w-[calc(100vw*380/375)] lg:w-[calc(100vw*1583/1440)] margin-auto"
        />
      </div>
      <div className="w-[90%] mx-auto pb-24 md:pb-44 mt-[100px] md:mt-[calc(100vw*150/1440)] flex flex-col gap-6 md:grid md:gap-0 md:grid-cols-[minmax(56px,1fr)_minmax(0,11fr)] md:grid-rows-[auto_auto_1fr] md:gap-x-8">
        <div className="md:col-start-2 md:row-start-1">
          <div className="flex justify-evenly md:justify-start items-center relative border-b-[3px] border-[#E9E9E7]">
            <div className="flex lg:gap-4 items-baseline justify-center md:justify-start w-full">
              <button
                onClick={() => setActiveTab('schedule')}
                type="button"
                className={`relative text-center md:text-left cursor-pointer font-jakarta text-3xl font-bold leading-normal md:tracking-[0.96px] w-1/2 md:w-auto md:pr-4 pb-2 bg-transparent border-none ${
                  activeTab === 'schedule'
                    ? 'text-[#3F3F3F] after:content-[""] after:absolute after:left-0 after:bottom-[-3px] after:w-full after:h-[3px] after:bg-[#3F3F3F] after:z-10'
                    : 'text-[#ACACB9]'
                }`}
              >
                All Events
              </button>
              <div className="w-1/2 md:w-auto">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setActiveTab('personal')}
                        type="button"
                        className={`relative text-center md:text-left cursor-pointer font-jakarta text-3xl font-bold leading-normal md:tracking-[0.96px] md:pr-4 pb-2 bg-transparent border-none ${
                          activeTab === 'personal'
                            ? 'text-[#3F3F3F] after:content-[""] after:absolute after:left-0 after:bottom-[-3px] after:w-full after:h-[3px] after:bg-[#3F3F3F] after:z-10'
                            : 'text-[#ACACB9]'
                        }`}
                      >
                        Personal
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-[#EDFBFA]">
                      <div className="flex gap-4 rounded-full items-center justify-between ">
                        <div className="relative rounded-full w-12 h-12">
                          <Image
                            src={TooltipCow}
                            alt="Tooltip Cow"
                            fill
                          ></Image>
                        </div>

                        <p>Make your own schedule by adding events!</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>

        <ScheduleMobileControls
          activeDay={activeDay}
          changeActiveDay={changeActiveDay}
          activeFilters={activeFilters}
          toggleFilter={toggleFilter}
          isMobileFilterOpen={isMobileFilterOpen}
          setIsMobileFilterOpen={setIsMobileFilterOpen}
        />

        <div className="hidden md:contents">
          <div className="min-w-0 flex-1 md:col-start-2 md:row-start-2 md:mt-8">
            <Filters
              toggleFilter={toggleFilter}
              activeFilters={activeFilters}
            />
          </div>

          <div className="shrink-0 flex flex-col gap-2 items-start md:col-start-1 md:row-start-2 md:mt-8">
            <button
              onClick={() => changeActiveDay('9')}
              type="button"
              className={`w-fit bg-transparent border-none p-0 text-left font-dm-mono text-base md:text-lg font-medium tracking-[0.36px] leading-[100%] inline-flex items-center ${
                activeDay === '9' ? 'text-[#3F3F3F]' : 'text-[#ACACB9]'
              }`}
            >
              {activeDay === '9' && (
                <span className="mr-2" aria-hidden>
                  {'\u2022'}
                </span>
              )}
              <span>MAY 9</span>
            </button>
            <button
              onClick={() => changeActiveDay('10')}
              type="button"
              className={`w-fit bg-transparent border-none p-0 text-left font-dm-mono text-base md:text-lg font-medium tracking-[0.36px] leading-[100%] inline-flex items-center ${
                activeDay === '10' ? 'text-[#3F3F3F]' : 'text-[#ACACB9]'
              }`}
            >
              {activeDay === '10' && (
                <span className="mr-2" aria-hidden>
                  {'\u2022'}
                </span>
              )}
              <span>MAY 10</span>
            </button>
          </div>
        </div>

        <div className="w-full md:col-start-2 md:row-start-3 mb-[100px] mt-2 md:mt-[24px] lg:mt-[48px]">
          {sortedGroupedEntries.length > 0 ? (
            sortedGroupedEntries.map(([timeKey, events]) => (
              <div key={timeKey} className="relative mb-[24px]">
                <div className="font-dm-mono text-sm md:text-lg font-normal leading-[145%] tracking-[0.36px] text-[#7C7C85] mt-[16px] mb-[6px]">
                  {timeKey}
                </div>
                <div>
                  {events.map((eventDetail) => (
                    <CalendarItem
                      key={eventDetail.event._id}
                      event={eventDetail.event}
                      attendeeCount={eventDetail.attendeeCount}
                      inPersonalSchedule={eventDetail.inPersonalSchedule}
                      tags={eventDetail.event.tags}
                      host={eventDetail.event.host}
                      onAddToSchedule={() =>
                        handleAddToSchedule(eventDetail.event._id || '')
                      }
                      onRemoveFromSchedule={() =>
                        handleRemoveFromSchedule(eventDetail.event._id || '')
                      }
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              {activeTab === 'personal' ? (
                <div>
                  <p className="mb-4">
                    No events in your personal schedule yet.
                  </p>
                  <Button
                    onClick={() => setActiveTab('schedule')}
                    className="w-full sm:w-fit px-8 py-2 border-2 border-black rounded-3xl border-dashed hover:border-solid cursor-pointer relative group"
                    variant="ghost"
                  >
                    <div className="absolute inset-0 rounded-3xl transition-all duration-300 ease-out cursor-pointer bg-black w-0 group-hover:w-full" />
                    <p className="font-semibold relative z-10 transition-colors duration-300 text-black group-hover:text-white">
                      Browse the schedule to add events
                    </p>
                  </Button>
                </div>
              ) : (
                'No events found for this day and filter(s).'
              )}
            </div>
          )}
        </div>
      </div>
      <div className="h-[calc(100vw*60/375)] md:h-0"></div>
      <Footer />
    </main>
  );
}
