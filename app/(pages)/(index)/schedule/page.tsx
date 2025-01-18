'use client';
import { useState } from 'react';

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

const mockScheduleData = {
  events: [
    {
      id: 1,
      title: 'Check-in',
      type: 'GENERAL',
      startTime: '2024-03-15T08:30:00Z',
      endTime: '2024-03-15T09:00:00Z',
      location: 'ARC Ballroom B',
    },
    {
      id: 2,
      title: 'Opening Ceremony',
      type: 'GENERAL',
      startTime: '2024-03-15T10:00:00Z',
      endTime: '2024-03-15T11:00:00Z',
      location: 'ARC Ballroom B',
    },
    {
      id: 3,
      title: 'HACKING STARTS',
      type: 'GENERAL',
      startTime: '2024-03-15T11:00:00Z',
      endTime: '2024-03-15T11:00:00Z',
    },
    {
      id: 4,
      title: 'Team Mixer',
      type: 'ACTIVITIES',
      startTime: '2024-03-15T11:00:00Z',
      endTime: '2024-03-15T12:00:00Z',
      location: 'ARC Ballroom B',
    },
    {
      id: 5,
      title: 'Workshop Name',
      type: 'WORKSHOP',
      startTime: '2024-03-15T11:00:00Z',
      endTime: '2024-03-15T12:00:00Z',
      location: 'ARC Ballroom B',
      speakers: [{ name: 'NAME', company: 'COMPANY NAME' }, { name: 'NAME' }],
      tags: ['BEGINNER', 'DEV'],
      attendeeCount: 15,
    },
    {
      id: 6,
      title: 'Lunch',
      type: 'MENU',
      startTime: '2024-03-15T12:00:00Z',
      endTime: '2024-03-15T13:30:00Z',
    },
  ],
};

const yourMockScheduleData = {
  events: [
    {
      id: 1,
      title: 'Check-in',
      type: 'GENERAL',
      startTime: '2024-03-15T08:30:00Z',
      endTime: '2024-03-15T09:00:00Z',
      location: 'ARC Ballroom B',
    },
    {
      id: 2,
      title: 'Opening Ceremony',
      type: 'GENERAL',
      startTime: '2024-03-15T10:00:00Z',
      endTime: '2024-03-15T11:00:00Z',
      location: 'ARC Ballroom B',
    },
    {
      id: 3,
      title: 'HACKING STARTS',
      type: 'GENERAL',
      startTime: '2024-03-15T11:00:00Z',
      endTime: '2024-03-15T11:00:00Z',
    },
    {
      id: 4,
      title: 'Lunch',
      type: 'MENU',
      startTime: '2024-03-15T12:00:00Z',
      endTime: '2024-03-15T13:30:00Z',
    },
  ],
};

export default function Page() {
  const [activeTab, setActiveTab] = useState<'schedule' | 'yourSchedule'>('schedule');
  const [activeDay, setActiveDay] = useState<'Apr19' | 'Apr20'>('Apr19');

  return (
    <main className="tw-h-screen tw-w-[1440px] tw-px-[80px] tw-mt-[60px]">
      <div className="tw-flex tw-flex-col tw-gap-8">
        <div className="tw-flex tw-gap-4 tw-items-baseline">
          <span
            onClick={() => setActiveTab('schedule')}
            className={`tw-tracking-[0.02em] tw-cursor-pointer tw-transition-all tw-duration-300 ${
              activeTab === 'schedule'
                ? 'tw-text-[48px] tw-font-bold tw-text-black'
                : 'tw-text-[32px] tw-font-semibold tw-text-[#00000040]'
            }`}
          >
            Schedule
          </span>
          <span
            onClick={() => setActiveTab('yourSchedule')}
            className={`tw-tracking-[0.02em] tw-cursor-pointer tw-transition-all tw-duration-300 ${
              activeTab === 'yourSchedule'
                ? 'tw-text-[48px] tw-font-bold tw-text-black'
                : 'tw-text-[32px] tw-font-semibold tw-text-[#00000040]'
            }`}
          >
            Your Schedule
          </span>
        </div>

        <div className="tw-flex tw-gap-[10px]">
          <button
            onClick={() => setActiveDay('Apr19')}
            className={`tw-px-[24px] tw-py-[12px] tw-rounded-[20px] tw-transition-all tw-duration-300 
              tw-text-center tw-text-[18px] tw-font-semibold tw-leading-[100%] tw-tracking-[0.36px]
              ${
              activeDay === 'Apr19'
                ? 'tw-bg-black tw-text-white'
                : 'tw-bg-white tw-text-black tw-border-[1.5px] tw-border-solid tw-border-black'
            }`}
          >
            Apr 19
          </button>
          <button
            onClick={() => setActiveDay('Apr20')}
            className={`tw-px-[24px] tw-py-[12px] tw-rounded-[20px] tw-transition-all tw-duration-300 
              tw-text-center tw-text-[18px] tw-font-semibold tw-leading-[100%] tw-tracking-[0.36px]
              ${
              activeDay === 'Apr20'
                ? 'tw-bg-black tw-text-white'
                : 'tw-bg-white tw-text-black tw-border-[1.5px] tw-border-solid tw-border-black'
            }`}
          >
            Apr 20
          </button>
        </div>
      </div>

      {activeTab === 'schedule' ? (
        <div>Schedule Content for {activeDay}</div>
      ) : (
        <div>Your Schedule Content for {activeDay}</div>
      )}
    </main>
  );
}
