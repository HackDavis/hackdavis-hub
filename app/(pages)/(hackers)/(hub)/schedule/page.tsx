'use client';
import { useState, useEffect, useMemo } from 'react';
import CalendarItem from '../../_components/Schedule/CalendarItem';
import Footer from '@components/Footer/Footer';
import Image from 'next/image';
import headerGrass from '@public/hackers/schedule/header_grass.svg';
import { getEvents } from '@actions/events/getEvent';
import Event, { EventType } from '@typeDefs/event';

export interface EventDetails {
  event: Event;
  attendeeCount?: number;
  inCustomSchedule?: boolean;
}

interface ScheduleData {
  [dayKey: string]: EventDetails[];
}

interface EventFilter {
  label: EventType;
  color: string;
}

export const filters: EventFilter[] = [
  { label: 'GENERAL', color: 'rgba(158, 231, 229, 1)' },
  { label: 'ACTIVITIES', color: 'rgba(255, 197, 171, 1)' },
  { label: 'WORKSHOPS', color: 'rgba(175, 209, 87, 1)' },
  { label: 'MEALS', color: 'rgba(255, 197, 61, 1)' },
  // { label: 'RECOMMENDED', color: '#BBABDD' },
];

export default function Page() {
  const [activeTab, setActiveTab] = useState<'schedule' | 'custom'>('schedule');
  const [hoveredTab, setHoveredTab] = useState<'schedule' | 'custom' | null>(
    null
  );
  const [activeDay, setActiveDay] = useState<'19' | '20'>('19');
  const [activeFilters, setActiveFilters] = useState<EventType[]>([]);
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        // TODO: add custom schedule handling
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
          acc[dayKey].push({ event: event });
          return acc;
        }, {});

        setScheduleData(groupedByDay);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    }

    fetchEvents();
  }, []);

  // Get current events for the active day, filtering by activeFilters.
  const currentEvents = useMemo(() => {
    if (!scheduleData) return [];
    // For MVP, both tabs use the same data.
    const unfilteredEvents = scheduleData[activeDay] || [];
    if (activeFilters.length === 0) {
      return unfilteredEvents;
    }
    return unfilteredEvents.filter((eventDetails) =>
      activeFilters.includes(eventDetails.event.type)
    );
  }, [activeDay, activeFilters, scheduleData]);
  // }, [activeTab, activeDay, activeFilters, scheduleData]);

  // Sort the current events by start time (ascending)
  const sortedEvents = useMemo(() => {
    return [...currentEvents].sort(
      (a, b) =>
        new Date(a.event.start_time).getTime() -
        new Date(b.event.start_time).getTime()
    );
  }, [currentEvents]);

  // Group sorted events by their start time (converted to PDT) for display.
  const groupedEvents = useMemo(() => {
    const groups: { [timeKey: string]: EventDetails[] } = {};
    sortedEvents.forEach((eventDetails) => {
      // Convert to PDT.
      const pstDate = new Date(
        eventDetails.event.start_time.toLocaleString('en-US', {
          timeZone: 'America/Los_Angeles',
        })
      );

      const timeKey = pstDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });

      if (!groups[timeKey]) {
        groups[timeKey] = [];
      }
      groups[timeKey].push(eventDetails);
    });

    return groups;
  }, [sortedEvents]);

  // Sort the group entries by time.
  const sortedGroupedEntries = useMemo(() => {
    return Object.entries(groupedEvents).sort((a, b) => {
      // Create dummy dates using an arbitrary day.
      const dummyDay = '01/01/2000';
      const dateA = new Date(`${dummyDay} ${a[0]}`);
      const dateB = new Date(`${dummyDay} ${b[0]}`);
      return dateA.getTime() - dateB.getTime();
    });
  }, [groupedEvents]);

  const toggleFilter = (label: EventType) => {
    const newFilters = activeFilters.includes(label)
      ? [...activeFilters, label]
      : activeFilters.filter((id) => id !== label);
    setActiveFilters(newFilters);
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
        <div className="flex flex-col gap-8">
          <div className="flex justify-evenly md:justify-between items-center relative border-b-4 border-[#8F8F8F33]">
            <div className="flex lg:gap-4 items-baseline justify-center md:justify-start w-full">
              <span
                onClick={() => setActiveTab('schedule')}
                onMouseEnter={() => setHoveredTab('schedule')}
                onMouseLeave={() => setHoveredTab(null)}
                className={`relative text-center md:text-left cursor-pointer font-metropolis text-3xl md:text-4xl lg:text-6xl font-bold leading-normal md:tracking-[0.96px] w-1/2 md:w-auto md:pr-4 pb-2 ${
                  (activeTab === 'schedule' && hoveredTab === null) ||
                  hoveredTab === 'schedule'
                    ? 'text-black after:content-[""] after:absolute after:left-0 after:bottom-[-4px] after:w-full after:h-[3px] after:bg-black after:z-10'
                    : 'text-[#8F8F8F]'
                }`}
              >
                Schedule
              </span>
              <span
                onClick={() => setActiveTab('custom')}
                onMouseEnter={() => setHoveredTab('custom')}
                onMouseLeave={() => setHoveredTab(null)}
                className={`relative text-center md:text-left cursor-pointer font-metropolis text-3xl md:text-4xl lg:text-6xl font-bold leading-normal md:tracking-[0.96px] w-1/2 md:w-auto md:pr-4 pb-2 ${
                  (activeTab === 'custom' && hoveredTab === null) ||
                  hoveredTab === 'custom'
                    ? 'text-black after:content-[""] after:absolute after:left-0 after:bottom-[-4px] after:w-full after:h-[3px] after:bg-black after:z-10'
                    : 'text-[#8F8F8F]'
                }`}
              >
                Custom
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

        <div className="px-[calc(100vw*32/375)] md:px-0 flex gap-4 mt-[28px] overflow-x-scroll no-scrollbar">
          {filters.map((filter) => (
            <button
              key={filter.label}
              onClick={() => toggleFilter(filter.label)}
              className={`
                relative flex w-[163px] h-[45px] px-[38px] py-[13px]
                justify-center items-center
                rounded-[22.5px] border-[1.5px]
                font-jakarta text-[16px] font-semibold leading-[100%] tracking-[0.32px]
                text-[#123041] transition-all duration-200
                ${
                  activeFilters.includes(filter.label)
                    ? `border-solid`
                    : 'border-dashed hover:bg-opacity-50'
                }
              `}
              style={{
                borderColor: filter.color,
                backgroundColor: activeFilters.includes(filter.label)
                  ? filter.color
                  : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (!activeFilters.includes(filter.label)) {
                  e.currentTarget.style.backgroundColor = filter.color + '80'; // 80 is 50% opacity in hex
                }
              }}
              onMouseLeave={(e) => {
                if (!activeFilters.includes(filter.label)) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {filter.label}
            </button>
          ))}
        </div>

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
