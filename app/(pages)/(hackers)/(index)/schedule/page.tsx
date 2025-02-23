'use client';
import { useState } from 'react';
import CalendarItem from '../_components/HackerHub/CalendarItem';
type EventType = 'GENERAL' | 'ACTIVITIES' | 'WORKSHOP' | 'MENU';

interface Event {
  id: number;
  title: string;
  type: EventType;
  startTime: string;
  endTime: string;
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

const mockScheduleData: ScheduleData = {
  Apr19: [
    {
      id: 1,
      title: 'Check-in',
      type: 'GENERAL',
      startTime: '2024-04-19T08:30:00Z',
      endTime: '2024-04-19T09:00:00Z',
      location: 'ARC Ballroom B',
    },
    {
      id: 2,
      title: 'Opening Ceremony',
      type: 'GENERAL',
      startTime: '2024-04-19T10:00:00Z',
      endTime: '2024-04-19T11:00:00Z',
      location: 'ARC Ballroom B',
    },
    {
      id: 3,
      title: 'HACKING STARTS',
      type: 'GENERAL',
      startTime: '2024-04-19T11:00:00Z',
      endTime: '2024-04-19T11:00:00Z',
    },
    {
      id: 4,
      title: 'Team Mixer',
      type: 'ACTIVITIES',
      startTime: '2024-04-19T11:30:00Z',
      endTime: '2024-04-19T12:00:00Z',
      location: 'ARC Ballroom B',
    },
    {
      id: 5,
      title: 'Intro to React Workshop',
      type: 'WORKSHOP',
      startTime: '2024-04-19T14:00:00Z',
      endTime: '2024-04-19T15:00:00Z',
      location: 'ARC Ballroom B',
      speakers: [{ name: 'John Doe', company: 'Tech Corp' }],
      tags: ['BEGINNER', 'DEV'],
      attendeeCount: 15,
    },
    {
      id: 6,
      title: 'Dinner',
      type: 'MENU',
      startTime: '2024-04-19T18:00:00Z',
      endTime: '2024-04-19T19:30:00Z',
    },
  ],
  Apr20: [
    {
      id: 7,
      title: 'Breakfast',
      type: 'MENU',
      startTime: '2024-04-20T08:00:00Z',
      endTime: '2024-04-20T09:00:00Z',
      location: 'ARC Ballroom A',
    },
    {
      id: 8,
      title: 'AI/ML Workshop',
      type: 'WORKSHOP',
      startTime: '2024-04-20T10:00:00Z',
      endTime: '2024-04-20T11:30:00Z',
      location: 'ARC Ballroom B',
      speakers: [{ name: 'Jane Smith', company: 'AI Solutions' }],
      tags: ['INTERMEDIATE', 'AI'],
      attendeeCount: 20,
    },
    {
      id: 9,
      title: 'Gaming Tournament',
      type: 'ACTIVITIES',
      startTime: '2024-04-20T13:00:00Z',
      endTime: '2024-04-20T15:00:00Z',
      location: 'Game Room',
    },
    {
      id: 10,
      title: 'HACKING ENDS',
      type: 'GENERAL',
      startTime: '2024-04-20T15:00:00Z',
      endTime: '2024-04-20T15:00:00Z',
    },
    {
      id: 11,
      title: 'Closing Ceremony',
      type: 'GENERAL',
      startTime: '2024-04-20T16:00:00Z',
      endTime: '2024-04-20T17:30:00Z',
      location: 'ARC Ballroom B',
    },
  ],
};

const yourMockScheduleData: ScheduleData = {
  Apr19: [
    {
      id: 1,
      title: 'Check-in',
      type: 'GENERAL',
      startTime: '2024-04-19T08:30:00Z',
      endTime: '2024-04-19T09:00:00Z',
      location: 'ARC Ballroom B',
    },
    {
      id: 5,
      title: 'Intro to React Workshop',
      type: 'WORKSHOP',
      startTime: '2024-04-19T14:00:00Z',
      endTime: '2024-04-19T15:00:00Z',
      location: 'ARC Ballroom B',
      speakers: [{ name: 'John Doe', company: 'Tech Corp' }],
      tags: ['BEGINNER', 'DEV'],
      attendeeCount: 15,
    },
  ],
  Apr20: [
    {
      id: 8,
      title: 'AI/ML Workshop',
      type: 'WORKSHOP',
      startTime: '2024-04-20T10:00:00Z',
      endTime: '2024-04-20T11:30:00Z',
      location: 'ARC Ballroom B',
      speakers: [{ name: 'Jane Smith', company: 'AI Solutions' }],
      tags: ['INTERMEDIATE', 'AI'],
      attendeeCount: 20,
    },
    {
      id: 11,
      title: 'Closing Ceremony',
      type: 'GENERAL',
      startTime: '2024-04-20T16:00:00Z',
      endTime: '2024-04-20T17:30:00Z',
      location: 'ARC Ballroom B',
    },
  ],
};

export default function Page() {
  const [activeTab, setActiveTab] = useState<'schedule' | 'yourSchedule'>(
    'schedule'
  );
  const [activeDay, setActiveDay] = useState<'Apr19' | 'Apr20'>('Apr19');

  const currentEvents =
    activeTab === 'schedule'
      ? mockScheduleData[activeDay]
      : yourMockScheduleData[activeDay];

  return (
    <main className="w-full px-[80px] mt-[60px]">
      <div className="flex flex-col gap-8">
        <div className="flex gap-4 items-baseline">
          <span
            onClick={() => setActiveTab('schedule')}
            className={`tw-tracking-[0.02em] tw-cursor-pointer tw-transition-all tw-duration-300 ${
              activeTab === 'schedule'
                ? 'text-[48px] font-bold text-black'
                : 'text-[32px] font-semibold text-[#00000040]'
            }`}
          >
            Schedule
          </span>
          <span
            onClick={() => setActiveTab('yourSchedule')}
            className={`tw-tracking-[0.02em] tw-cursor-pointer tw-transition-all tw-duration-300 ${
              activeTab === 'yourSchedule'
                ? 'text-[48px] font-bold text-black'
                : 'text-[32px] font-semibold text-[#00000040]'
            }`}
          >
            Your Schedule
          </span>
        </div>

        <div className="flex gap-[10px] mb-[37px]">
          <button
            onClick={() => setActiveDay('Apr19')}
            className={`px-[24px] py-[12px] rounded-[20px] transition-all duration-300 
              text-center text-[18px] font-semibold leading-[100%] tracking-[0.36px]
              ${
                activeDay === 'Apr19'
                  ? 'bg-black text-white'
                  : 'bg-white text-black border-[1.5px] border-solid border-black'
              }`}
          >
            Apr 19
          </button>
          <button
            onClick={() => setActiveDay('Apr20')}
            className={`px-[24px] py-[12px] rounded-[20px] transition-all duration-300 
              text-center text-[18px] font-semibold leading-[100%] tracking-[0.36px]
              ${
                activeDay === 'Apr20'
                  ? 'bg-black text-white'
                  : 'bg-white text-black border-[1.5px] border-solid border-black'
              }`}
          >
            Apr 20
          </button>
        </div>
      </div>

      <div className="mb-[100px]">
        {currentEvents.map((event) => (
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
    </main>
  );
}
