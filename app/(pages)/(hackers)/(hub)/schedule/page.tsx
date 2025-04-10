'use client';
import { useState, useEffect, useMemo } from 'react';
import CalendarItem from '../../_components/Schedule/CalendarItem';
import Loader from '@components/Loader/Loader';
import Footer from '@components/Footer/Footer';
import Image from 'next/image';
import headerGrass from '@public/hackers/schedule/header_grass.svg';
import Event, { EventType } from '@typeDefs/event';
import { Button } from '@pages/_globals/components/ui/button';
import Filters from '@pages/(hackers)/_components/Schedule/Filters';
import JudgeLoading from '@pages/judges/(app)/_components/Loading/Loading';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@globals/components/ui/tooltip';
import TooltipCow from '@public/index/schedule/vocal_angel_cow.svg';
import useActiveUser from '@pages/_hooks/useActiveUser';
import { usePersonalEvents } from './_hooks/usePersonalEvents';
import { useEvents } from './_hooks/useEvents';

export interface EventDetails {
  event: Event;
  attendeeCount?: number;
  inPersonalSchedule?: boolean;
}

interface ScheduleData {
  [dayKey: string]: EventDetails[];
}

export default function Page() {
  const { user, loading: userLoading } = useActiveUser('/');

  // Use the events hook to get events with attendee counts
  const {
    eventsWithAttendeeCount,
    isLoading: eventsLoading,
    error: eventsError,
    refreshEvents,
  } = useEvents();

  const [activeTab, setActiveTab] = useState<'schedule' | 'personal'>(
    'schedule'
  );
  const [hoveredTab, setHoveredTab] = useState<'schedule' | 'personal' | null>(
    null
  );
  const [activeDay, setActiveDay] = useState<'19' | '20'>('19');
  const [activeFilters, setActiveFilters] = useState<EventType[]>([]);
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);
  const [isActionInProgress, setIsActionInProgress] = useState(false);

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

  // Update this useEffect to use eventsWithAttendeeCount instead of fetching events directly
  useEffect(() => {
    if (eventsWithAttendeeCount.length > 0 && !personalEventsLoading) {
      // Group events by day key - "19" or "20".
      const groupedByDay = eventsWithAttendeeCount.reduce(
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
          });
          return acc;
        },
        {}
      );

      setScheduleData(groupedByDay);
    }
  }, [
    eventsWithAttendeeCount,
    personalEvents,
    isInPersonalSchedule,
    personalEventsLoading,
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

      // Find the attendee count for this event from eventsWithAttendeeCount
      const eventWithCount = eventsWithAttendeeCount.find(
        (e) => e.event._id === event._id
      );

      acc[dayKey].push({
        event,
        attendeeCount: eventWithCount?.attendeeCount || 0,
        inPersonalSchedule: true,
      });
      return acc;
    }, {});

    return groupedByDay;
  }, [personalEvents, eventsWithAttendeeCount]);

  const dataToUse =
    activeTab === 'personal' ? personalScheduleData : scheduleData;

  // Combined transformation: filtering, sorting, grouping and then sorting the groups.
  const sortedGroupedEntries = useMemo(() => {
    if (!dataToUse) return [];

    // Filter events for the active day and by active filters.
    const unfilteredEvents = dataToUse[activeDay] || [];
    const filteredEvents =
      activeFilters.length === 0
        ? unfilteredEvents
        : unfilteredEvents.filter((ed) =>
            activeFilters.includes(ed.event.type)
          );

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

  const toggleFilter = (label: EventType) => {
    if (activeFilters.includes(label)) {
      setActiveFilters(activeFilters.filter((id) => id !== label));
    } else {
      setActiveFilters([...activeFilters, label]);
    }
  };

  // Update the loading state to include eventsLoading
  const isLoading =
    userLoading ||
    personalEventsLoading ||
    eventsLoading ||
    !scheduleData ||
    isActionInProgress;

  const isError = personalEventsError || eventsError;

  // Determine if we're in a loading state
  if (isLoading)
    return (
      <div id="schedule">
        <JudgeLoading />
      </div>
    );

  if (isError) return <div id="schedule">Error Loading Events</div>;

  return (
    <main id="schedule" className="w-full">
      <div className="absolute aspect-[380/75] lg:aspect-[1583/351] w-full top-[calc(-1*100vw*11/375)] lg:top-[calc(-1*100vw*10/1440)] z-0 overflow-x-clip">
        <Image
          src={headerGrass}
          alt="header-grass"
          className="w-[calc(100vw*380/375)] lg:w-[calc(100vw*1583/1440)] margin-auto"
        />
      </div>
      <div className="pb-24 md:pb-44 md:px-[calc(100vw*76/768)] lg:md:px-[calc(100vw*151/1440)] mt-[100px] md:mt-[calc(100vw*150/1440)]">
        {/* Headers */}
        <div className="flex flex-col gap-8">
          <div className="flex justify-evenly md:justify-between items-center relative border-b-4 border-[#8F8F8F33]">
            <div className="flex lg:gap-4 items-baseline justify-center md:justify-start w-full">
              <span
                onClick={() => setActiveTab('schedule')}
                onMouseEnter={() => setHoveredTab('schedule')}
                onMouseLeave={() => setHoveredTab(null)}
                className={`relative text-center md:text-left cursor-pointer font-metropolis text-3xl font-bold leading-normal md:tracking-[0.96px] w-1/2 md:w-auto md:pr-4 pb-2 ${
                  activeTab === 'schedule'
                    ? 'text-black after:content-[""] after:absolute after:left-0 after:bottom-[-4px] after:w-full after:h-[3px] after:bg-black after:z-10'
                    : hoveredTab === 'schedule'
                    ? 'text-black'
                    : 'text-[#8F8F8F]'
                }`}
              >
                All Events
              </span>
              <span
                onClick={() => setActiveTab('personal')}
                onMouseEnter={() => setHoveredTab('personal')}
                onMouseLeave={() => setHoveredTab(null)}
                className={`relative text-center md:text-left cursor-pointer font-metropolis text-3xl font-bold leading-normal md:tracking-[0.96px] w-1/2 md:w-auto md:pr-4 pb-2 ${
                  activeTab === 'personal'
                    ? 'text-black after:content-[""] after:absolute after:left-0 after:bottom-[-4px] after:w-full after:h-[3px] after:bg-black after:z-10'
                    : hoveredTab === 'personal'
                    ? 'text-black'
                    : 'text-[#8F8F8F]'
                }`}
              >
                {/* Personal */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>Personal</TooltipTrigger>
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
              </span>
            </div>

            <div className="fixed bottom-4 z-20 md:static md:flex lg:pt-[10px]">
              <div
                className="relative bg-[#ffffffe6] md:bg-transparent flex items-center w-[202px] h-[48px] md:border-[1.5px] md:border-black rounded-[22px]"
                style={{ borderStyle: 'dashed' }}
              >
                <div
                  className={`absolute top-auto bottom-auto transition-all duration-300 ease-in-out w-[98px] h-[42px] bg-black rounded-[20px] ${
                    activeDay === '19'
                      ? 'left-[1.5px] top-[1.5px]'
                      : 'left-[98.5px] top-[1.5px]'
                  }`}
                />
                <button
                  onClick={() => setActiveDay('19')}
                  className={`relative z-10 flex-1 font-jakarta text-[18px] font-weight-[600] font-normal tracking-[0.36px] leading-[100%] bg-transparent ${
                    activeDay === '19' ? 'text-white' : 'text-black'
                  }`}
                >
                  Apr 19
                </button>
                <button
                  onClick={() => setActiveDay('20')}
                  className={`relative z-10 flex-1 font-jakarta text-[18px] font-weight-[600] font-normal tracking-[0.36px] leading-[100%] bg-transparent ${
                    activeDay === '20' ? 'text-white' : 'text-black'
                  }`}
                >
                  Apr 20
                </button>
              </div>
            </div>
          </div>
        </div>
        <Filters toggleFilter={toggleFilter} activeFilters={activeFilters} />

        <div className="px-[calc(100vw*30/375)] md:px-0 mb-[100px] mt-[24px] lg:mt-[48px]">
          {sortedGroupedEntries.length > 0 ? (
            sortedGroupedEntries.map(([timeKey, events]) => (
              <div key={timeKey} className="relative mb-[24px]">
                <div className="font-jakarta text-lg font-normal leading-[145%] tracking-[0.36px] text-black mt-[16px] mb-[6px]">
                  {timeKey}
                </div>
                <div>
                  {events.map((eventDetail) => (
                    <CalendarItem
                      key={eventDetail.event._id}
                      event={eventDetail.event}
                      attendeeCount={eventDetail.attendeeCount}
                      inPersonalSchedule={eventDetail.inPersonalSchedule}
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
                'No events found for this day and filters.'
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
