'use client';
import { useState, useEffect, useMemo } from 'react';
import CalendarItem from '../../_components/Schedule/CalendarItem';
import Footer from '@app/(pages)/_components/Footer/Footer';
import Image from 'next/image';
import headerGrass from '@public/hackers/schedule/header_grass.svg';
import { getEvents } from '@actions/events/getEvent';

type EventType = 'general' | 'activity' | 'workshop' | 'meal';

interface Event {
  id: number;
  name: string;
  type: EventType;
  start_time: string;
  end_time?: string;
  location?: string;
  speakers?: {
    name: string;
    company?: string;
  }[];
  tags?: string[];
  attendeeCount?: number;
}

interface ScheduleData {
  [dayKey: string]: Event[];
}

interface FilterType {
  id: string;
  label: string;
  color: string;
}

const filters: FilterType[] = [
  { id: 'general', label: 'GENERAL', color: '#9EE7E5' },
  { id: 'activity', label: 'ACTIVITIES', color: '#FFC5AB' },
  { id: 'workshop', label: 'WORKSHOPS', color: '#AFD157' },
  { id: 'meal', label: 'MENU', color: '#FFC53D' },
  // { id: 'recommended', label: 'RECOMMENDED', color: '#BBABDD' },
];

export default function Page() {
  const [activeTab, setActiveTab] = useState<'schedule' | 'yourSchedule'>(
    'schedule'
  );
  const [activeDay, setActiveDay] = useState<'Apr19' | 'Apr20'>('Apr19');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);

  // Fetch events from the server action on mount.
  useEffect(() => {
    async function fetchEvents() {
      try {
        // Pass an empty query object; adjust if needed.
        const response = await getEvents({});
        if (response.ok) {
          const events: Event[] = response.body;
          // Group events by day key, e.g. "Apr19" or "Apr20".
          const groupedByDay = events.reduce((acc: ScheduleData, event) => {
            const date = new Date(event.start_time);
            const dayKey = date
              .toLocaleString('en-US', { month: 'short', day: 'numeric' })
              .replace(' ', '');
            if (!acc[dayKey]) {
              acc[dayKey] = [];
            }
            acc[dayKey].push(event);
            return acc;
          }, {});
          setScheduleData(groupedByDay);
        } else {
          console.error('Error fetching events:', response.error);
        }
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
    return unfilteredEvents.filter((event) =>
      activeFilters.includes(event.type)
    );
  }, [activeTab, activeDay, activeFilters, scheduleData]);

  // First, sort the current events by start time (ascending)
  const sortedEvents = useMemo(() => {
    return [...currentEvents].sort(
      (a, b) =>
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    );
  }, [currentEvents]);

  // Group sorted events by their start time (converted to PST) for display.
  const groupedEvents = useMemo(() => {
    const groups: { [timeKey: string]: Event[] } = {};
    sortedEvents.forEach((event) => {
      const date = new Date(event.start_time);
      // Convert to PST.
      const pstDate = new Date(
        date.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })
      );
      const timeKey = pstDate.toLocaleString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });

      if (!groups[timeKey]) {
        groups[timeKey] = [];
      }
      groups[timeKey].push(event);
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

  const toggleFilter = (filterId: string) => {
    setActiveFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId]
    );
  };

  return (
    <main className="w-full">
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
                className={`relative text-center md:text-left cursor-pointer font-metropolis text-3xl md:text-4xl lg:text-6xl font-bold leading-normal md:tracking-[0.96px] w-1/2 md:w-auto md:pr-4 pb-2 ${
                  activeTab === 'schedule'
                    ? 'text-black after:content-[""] after:absolute after:left-0 after:bottom-[-4px] after:w-full after:h-[3px] after:bg-black after:z-10'
                    : 'text-[#8F8F8F]'
                }`}
              >
                Schedule
              </span>
              <span
                onClick={() => setActiveTab('yourSchedule')}
                className={`relative text-center md:text-left cursor-pointer font-metropolis text-3xl md:text-4xl lg:text-6xl font-bold leading-normal md:tracking-[0.96px] w-1/2 md:w-auto md:pr-4 pb-2 ${
                  activeTab === 'yourSchedule'
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
                  className={`absolute transition-all duration-300 ease-in-out w-[98px] h-[42px] bg-black rounded-[20px] ${
                    activeDay === 'Apr19'
                      ? 'left-[1.5px] top-[1.5px]'
                      : 'left-[98.5px] top-[1.5px]'
                  }`}
                />
                <button
                  onClick={() => setActiveDay('Apr19')}
                  className={`relative z-10 flex-1 font-jakarta text-[18px] font-weight-[600] font-normal tracking-[0.36px] leading-[100%] bg-transparent ${
                    activeDay === 'Apr19' ? 'text-white' : 'text-black'
                  }`}
                >
                  Apr 19
                </button>
                <button
                  onClick={() => setActiveDay('Apr20')}
                  className={`relative z-10 flex-1 font-jakarta text-[18px] font-weight-[600] font-normal tracking-[0.36px] leading-[100%] bg-transparent ${
                    activeDay === 'Apr20' ? 'text-white' : 'text-black'
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
              key={filter.id}
              onClick={() => toggleFilter(filter.id)}
              className={`
                relative flex w-[163px] h-[45px] px-[38px] py-[13px]
                justify-center items-center
                rounded-[22.5px] border-[1.5px]
                font-jakarta text-[16px] font-semibold leading-[100%] tracking-[0.32px]
                text-[#123041] transition-all duration-200
                ${
                  activeFilters.includes(filter.id)
                    ? `border-solid`
                    : 'border-dashed hover:bg-opacity-50'
                }
              `}
              style={{
                borderColor: filter.color,
                backgroundColor: activeFilters.includes(filter.id)
                  ? filter.color
                  : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (!activeFilters.includes(filter.id)) {
                  e.currentTarget.style.backgroundColor = filter.color + '80';
                }
              }}
              onMouseLeave={(e) => {
                if (!activeFilters.includes(filter.id)) {
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
                      key={event.id}
                      name={event.name}
                      type={event.type}
                      start_time={event.start_time}
                      end_time={event.end_time}
                      location={event.location}
                      speakers={event.speakers}
                      tags={event.tags}
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
