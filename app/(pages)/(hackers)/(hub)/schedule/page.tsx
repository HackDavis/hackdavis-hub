'use client';
import { useState, useMemo } from 'react';
import CalendarItem from '../../_components/Schedule/CalendarItem';
import Footer from '@components/Footer/Footer';
type EventType = 'GENERAL' | 'ACTIVITIES' | 'WORKSHOP' | 'MENU';
import Image from 'next/image';

import headerGrass from '@public/hackers/schedule/header_grass.svg';

interface Event {
  id: number;
  title: string;
  type: EventType;
  startTime: string;
  endTime?: string;
  location?: string;
  speakers?: {
    name: string;
    company?: string;
  }[];
  tags?: string[];
  attendeeCount?: number;
}

interface ScheduleData {
  [key: string]: Event[];
}

interface FilterType {
  id: string;
  label: string;
  color: string;
}

const filters: FilterType[] = [
  { id: 'GENERAL', label: 'GENERAL', color: '#9EE7E5' },
  { id: 'ACTIVITIES', label: 'ACTIVITIES', color: '#FFC5AB' },
  // { id: 'WORKSHOP', label: 'WORKSHOPS', color: '#AFD157' },
  // { id: 'MENU', label: 'MENU', color: '#FFC53D' },
  // { id: 'RECOMMENDED', label: 'RECOMMENDED', color: '#BBABDD' },
];

const mockScheduleData: ScheduleData = {
  Apr19: [
    {
      id: 1,
      title: 'Check-in Starts',
      type: 'GENERAL',
      startTime: '2024-04-19T14:30:00Z',
    },
    {
      id: 2,
      title: 'Team Mixer',
      type: 'ACTIVITIES',
      startTime: '2024-04-19T15:30:00Z',
      endTime: '2024-04-19T17:00:00Z',
      location: 'ARC Ballroom B',
    },
    {
      id: 3,
      title: 'Opening Ceremony',
      type: 'GENERAL',
      startTime: '2024-04-19T17:00:00Z',
      endTime: '2024-04-19T18:00:00Z',
    },
    {
      id: 4,
      title: 'Hacking Starts',
      type: 'GENERAL',
      startTime: '2024-04-19T18:00:00Z',
    },
    {
      id: 5,
      title: 'Check-in Closes',
      type: 'GENERAL',
      startTime: '2024-04-19T23:00:00Z',
    },
  ],
  Apr20: [
    {
      id: 6,
      title: 'Closing Ceremony',
      type: 'GENERAL',
      startTime: '2024-04-20T22:00:00Z',
      endTime: '2024-04-20T23:00:00Z',
    },
  ],
};

// const yourMockScheduleData: ScheduleData = {
//   Apr19: [],
//   Apr20: [],
// };

// for MVP only:
const yourMockScheduleData: ScheduleData = mockScheduleData;

export default function Page() {
  const [activeTab, setActiveTab] = useState<'schedule' | 'yourSchedule'>(
    'schedule'
  );
  const [hoveredTab, setHoveredTab] = useState<
    'schedule' | 'yourSchedule' | null
  >(null);
  const [activeDay, setActiveDay] = useState<'Apr19' | 'Apr20'>('Apr19');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const currentEvents = useMemo(() => {
    const unfilteredEvents =
      activeTab === 'schedule'
        ? mockScheduleData[activeDay]
        : yourMockScheduleData[activeDay];

    if (activeFilters.length === 0) {
      return unfilteredEvents;
    }

    return unfilteredEvents.filter(
      (event) =>
        activeFilters.includes(event.type) ||
        (activeFilters.includes('RECOMMENDED') &&
          event.tags?.includes('RECOMMENDED'))
    );
  }, [activeTab, activeDay, activeFilters]);

  // Group events by start time
  const groupedEvents = useMemo(() => {
    const groups: { [key: string]: Event[] } = {};

    currentEvents.forEach((event) => {
      const date = new Date(event.startTime);
      // Convert to PST
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
  }, [currentEvents]);

  const toggleFilter = (filterId: string) => {
    setActiveFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId]
    );
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
                onClick={() => setActiveTab('yourSchedule')}
                onMouseEnter={() => setHoveredTab('yourSchedule')}
                onMouseLeave={() => setHoveredTab(null)}
                className={`relative text-center md:text-left cursor-pointer font-metropolis text-3xl md:text-4xl lg:text-6xl font-bold leading-normal md:tracking-[0.96px] w-1/2 md:w-auto md:pr-4 pb-2 ${
                  (activeTab === 'yourSchedule' && hoveredTab === null) ||
                  hoveredTab === 'yourSchedule'
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
                  e.currentTarget.style.backgroundColor = filter.color + '80'; // 80 is 50% opacity in hex
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
          {Object.entries(groupedEvents).map(([timeKey, events]) => (
            <div key={timeKey} className="relative mb-[24px]">
              <div className="font-jakarta text-lg font-normal leading-[145%] tracking-[0.36px] text-black mt-[16px] mb-[6px]">
                {timeKey}
              </div>
              <div>
                {events.map((event) => (
                  <CalendarItem
                    key={event.id}
                    title={event.title}
                    type={event.type}
                    startTime={event.startTime}
                    endTime={event.endTime}
                    location={event.location}
                    speakers={event.speakers}
                    tags={event.tags}
                    attendeeCount={event.attendeeCount}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="h-[calc(100vw*60/375)] md:h-0"></div>
      <Footer />
    </main>
  );
}
