'use client';
import { useState, useEffect, useMemo } from 'react';
import CalendarItem from '../../_components/Schedule/CalendarItem';
import Footer from '@components/Footer/Footer';
import Image from 'next/image';
import headerGrass from '@public/hackers/schedule/header_grass.svg';
import { getEvents } from '@actions/events/getEvent';
import Event, { EventType } from '@typeDefs/event';
import Filters from '@pages/(hackers)/_components/Schedule/Filters';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@globals/components/ui/tooltip';
import TooltipCow from '@public/index/schedule/vocal_angel_cow.svg';

export interface EventDetails {
  event: Event;
  attendeeCount?: number;
  inpersonalSchedule?: boolean;
}

interface ScheduleData {
  [dayKey: string]: EventDetails[];
}

export default function Page() {
  const [activeTab, setActiveTab] = useState<'schedule' | 'personal'>(
    'schedule'
  );
  const [hoveredTab, setHoveredTab] = useState<'schedule' | 'personal' | null>(
    null
  );
  const [activeDay, setActiveDay] = useState<'19' | '20'>('19');
  const [activeFilters, setActiveFilters] = useState<EventType[]>([]);
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        // TODO: add personal schedule handling
        const response = await getEvents({});
        if (!response.ok) {
          throw new Error(response.error || 'Internal server error');
        }
        const events: Event[] = response.body;

        // Group events by day key - "19" or "20".
        const groupedByDay = events.reduce((acc: ScheduleData, event) => {
          const dayKey = event.start_time.toLocaleString('en-US', {
            timeZone: 'America/Los_Angeles',
            day: 'numeric',
          });
          if (!acc[dayKey]) {
            acc[dayKey] = [];
          }
          acc[dayKey].push({ event });
          return acc;
        }, {});

        setScheduleData(groupedByDay);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    }
    fetchEvents();
  }, []);

  // Combined transformation: filtering, sorting, grouping and then sorting the groups.
  const sortedGroupedEntries = useMemo(() => {
    if (!scheduleData) return [];

    // Filter events for the active day and by active filters.
    const unfilteredEvents = scheduleData[activeDay] || [];
    const filteredEvents =
      activeFilters.length === 0
        ? unfilteredEvents
        : unfilteredEvents.filter((ed) =>
            activeFilters.includes(ed.event.type)
          );

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
  }, [scheduleData, activeDay, activeFilters]);

  const toggleFilter = (label: EventType) => {
    if (activeFilters.includes(label)) {
      setActiveFilters(activeFilters.filter((id) => id !== label));
    } else {
      setActiveFilters([...activeFilters, label]);
    }
  };

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
                className={`relative text-center md:text-left cursor-pointer font-metropolis text-3xl md:text-4xl lg:text-6xl font-bold leading-normal md:tracking-[0.96px] w-1/2 md:w-auto md:pr-4 pb-2 ${
                  activeTab === 'schedule'
                    ? 'text-black after:content-[""] after:absolute after:left-0 after:bottom-[-4px] after:w-full after:h-[3px] after:bg-black after:z-10'
                    : hoveredTab === 'schedule'
                    ? 'text-black'
                    : 'text-[#8F8F8F]'
                }`}
              >
                Schedule
              </span>
              <span
                onClick={() => setActiveTab('personal')}
                onMouseEnter={() => setHoveredTab('personal')}
                onMouseLeave={() => setHoveredTab(null)}
                className={`relative text-center md:text-left cursor-pointer font-metropolis text-3xl md:text-4xl lg:text-6xl font-bold leading-normal md:tracking-[0.96px] w-1/2 md:w-auto md:pr-4 pb-2 ${
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
                    <TooltipContent side="bottom">
                      <div className="flex gap-4 rounded-full items-center justify-between">
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
          {scheduleData ? (
            sortedGroupedEntries.map(([timeKey, events]) => (
              <div key={timeKey} className="relative mb-[24px]">
                <div className="font-jakarta text-lg font-normal leading-[145%] tracking-[0.36px] text-black mt-[16px] mb-[6px]">
                  {timeKey}
                </div>
                <div>
                  {events.map((event) => (
                    <CalendarItem
                      key={event.event._id}
                      event={event.event}
                      attendeeCount={event.attendeeCount}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div>Loading events…</div>
          )}
        </div>
      </div>
      <div className="h-[calc(100vw*60/375)] md:h-0"></div>
      <Footer />
    </main>
  );
}
