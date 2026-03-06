'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import CalendarItem from '@pages/(hackers)/_components/Schedule/CalendarItem';
import {
  EventEntry,
  useScheduleSneakPeekData,
} from '../../../_hooks/useScheduleSneakPeekData';

import sleeping_cow from '@public/hackers/hero/sleeping_cow.svg';
import duckbunny from '@public/hackers/hero/scheduleSneakPeek/duck+bunny.svg';
import duckfrog from '@public/hackers/hero/scheduleSneakPeek/duck+frog.svg';
import cucumber_cow from '@public/hackers/hero/scheduleSneakPeek/cucumber_cow.svg';

interface ScheduleSneakPeekProps {
  className?: string;
}

function SectionLabel({ label }: { label: string }) {
  const isLiveLabel = label.trim().toUpperCase() === '\u2022 LIVE';
  const displayLabel = isLiveLabel ? 'LIVE' : label;

  return (
    <div className="font-dm-mono text-lg leading-[100%] tracking-[0.36px] text-[#7C7C85] mt-5 mb-4 inline-flex items-center gap-2">
      {isLiveLabel && (
        <span
          aria-hidden
          className="relative inline-flex items-center justify-center w-3 h-3 shrink-0"
        >
          <span className="absolute inset-0 rounded-full bg-[#E9FBBA] z-0" />
          <span className="absolute w-2 h-2 rounded-full bg-[#D1F76E] z-10 live-indicator-inner" />
        </span>
      )}
      {displayLabel}
    </div>
  );
}

function CountdownLabel({ targetTime }: { targetTime: number }) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetTime - new Date().getTime();
      if (difference <= 0) {
        return { hours: 0, minutes: 0, seconds: 0 };
      }
      return {
        hours: Math.floor(difference / (1000 * 60 * 60)),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetTime]);

  const label = `IN ${timeLeft.hours
    .toString()
    .padStart(2, '0')}:${timeLeft.minutes
    .toString()
    .padStart(2, '0')}:${timeLeft.seconds.toString().padStart(2, '0')}`;

  return <SectionLabel label={label} />;
}

function Panel({
  title,
  liveEvents,
  upcomingEvents,
  onAddToSchedule,
  onRemoveFromSchedule,
}: {
  title: string;
  liveEvents: EventEntry[];
  upcomingEvents: EventEntry[];
  onAddToSchedule: (eventId: string) => Promise<boolean>;
  onRemoveFromSchedule: (eventId: string) => Promise<boolean>;
}) {
  const renderEventItems = (events: EventEntry[], keyPrefix: string) =>
    events.map((entry) => (
      <CalendarItem
        key={`${keyPrefix}-${entry.event._id}`}
        event={entry.event}
        attendeeCount={entry.attendeeCount}
        inPersonalSchedule={entry.inPersonalSchedule}
        tags={entry.event.tags}
        host={entry.event.host}
        onAddToSchedule={() => {
          void onAddToSchedule(entry.event._id || '');
        }}
        onRemoveFromSchedule={() => {
          void onRemoveFromSchedule(entry.event._id || '');
        }}
      />
    ));

  const upcomingGroups = useMemo(() => {
    const groups: { startTime: number; entries: EventEntry[] }[] = [];
    for (const entry of upcomingEvents) {
      const startTime = new Date(entry.event.start_time).getTime();
      const existing = groups.find((g) => g.startTime === startTime);
      if (existing) {
        existing.entries.push(entry);
      } else {
        groups.push({ startTime, entries: [entry] });
      }
    }
    return groups.sort((a, b) => a.startTime - b.startTime);
  }, [upcomingEvents]);

  return (
    <div className="rounded-[16px] bg-[#FFFFFF] p-5 lg:p-6">
      <h2 className="font-jakarta text-[clamp(1.1rem,3vw,2.25rem)] font-semibold leading-tight tracking-[0.64px] text-[#3F3F3F] mb-4">
        {title}
      </h2>
      <div className="border-b border-[#E3E3E3] mb-6" />

      <SectionLabel label="• LIVE" />
      <div className="space-y-3 mb-[3vw]">
        {liveEvents.length > 0 ? (
          renderEventItems(liveEvents, 'live')
        ) : (
          <div className="bg-[#F3F3FC] rounded-[12px] flex flex-col items-center p-[36px] gap-[12px]">
            <Image
              src={title === 'Happening now' ? cucumber_cow : duckbunny}
              alt={
                title === 'Happening now'
                  ? 'Cow with cucumber over their eyes'
                  : 'Duck on top of bunny'
              }
            />
            <p className="font-semibold text-center text-[#3F3F3F] text-[16px] tracking-[0.64px]">
              {title === 'Your schedule'
                ? 'No live events on your schedule'
                : 'No live events'}
            </p>
            <p className="text-center text-[#7C7C85] md:w-[70%] text-[14px] tracking-[0.64px]">
              This is where you’ll see live events. Seems like there’s nothing
              going on at the moment!
            </p>
            <Link
              href="/schedule"
              className="hover:brightness-[97%] hover:saturate-[140%]"
            >
              {title == 'Your schedule' ? (
                <button className="bg-[#CCFFFE] text-[#003D3D] rounded-full p-[12px] font-semibold text-center px-[24px] text-[14px] tracking-[0.64px]">
                  Add to your schedule
                </button>
              ) : null}
            </Link>
          </div>
        )}
      </div>

      {/* <SectionLabel label="IN 0:30:00" />
      <div className="space-y-3">
        {upcomingEvents.length > 0 ? (
          renderEventItems(upcomingEvents, 'upcoming')
        ) : (
          <div className="bg-[#F3F3FC] rounded-[12px] flex flex-col items-center p-[36px] gap-[12px]">
            <Image
              src={title === 'Happening now' ? sleeping_cow : duckfrog}
              alt={
                title === 'Happening now'
                  ? 'Sleeping cow'
                  : 'Duck on top of frog'
              }
            />
            <p className="font-semibold text-center text-[#3F3F3F] text-[16px] tracking-[0.64px]">
              {title === 'Your schedule'
                ? 'No upcoming events on your schedule'
                : 'No upcoming events'}
            </p>
            <p className="text-center text-[#7C7C85] md:w-[70%] text-[14px] tracking-[0.64px]">
              {title === 'Your schedule'
                ? 'This is where you’ll see upcoming events. Seems like there’s nothing coming up! Take a look to see if there’s anything you want to check out.'
                : 'This is where you’ll  see upcoming events. Seems like there’s nothing coming up!'}
            </p>
            <Link
              href="/schedule"
              className="hover:brightness-[97%] hover:saturate-[140%]"
            >
              {title == 'Your schedule' ? (
                <button className="bg-[#CCFFFE] text-[#003D3D] rounded-full p-[12px] font-semibold text-center px-[24px] text-[14px] tracking-[0.64px]">
                  Explore events
                </button>
              ) : null}
            </Link>
          </div>
        )}
      </div> */}
      {upcomingGroups.map((group) => (
        <div key={group.startTime}>
          <CountdownLabel targetTime={group.startTime} />
          <div className="space-y-3">
            {renderEventItems(group.entries, `upcoming-${group.startTime}`)}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ScheduleSneakPeek({
  className,
}: ScheduleSneakPeekProps) {
  const {
    liveAll,
    upcomingAll,
    livePersonal,
    upcomingPersonal,
    addToPersonalSchedule,
    removeFromPersonalSchedule,
  } = useScheduleSneakPeekData();

  return (
    <div id="schedule-sneak-peek" className="w-full bg-[#FAFAFF]">
      <section className={`w-[90%] mx-auto py-[5vw] ${className ?? ''}`}>
        <div className="inline-flex items-center group font-jakarta text-[clamp(1.25rem,4.2vw,3rem)] font-semibold leading-tight tracking-[0.72px] text-[#3F3F3F] whitespace-nowrap">
          <span className="w-0 group-hover:w-[20px] md:group-hover:w-[35px]  overflow-hidden transition-all duration-300 ease-out shrink-0">
            <Image
              src="/icons/arrow-right.svg"
              alt=""
              width={35}
              height={35}
              className="-translate-x-3 group-hover:translate-x-0 transition-transform duration-300 ease-out"
            />
          </span>
          <span className="transition-transform duration-300 ease-out group-hover:translate-x-1">
            Sneak Peek at Your{' '}
            <Link href="/schedule" className="underline hover:opacity-80">
              Schedule
            </Link>
          </span>
        </div>

        <div className="border-b border-[#E3E3E3] mt-4 mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
          <Panel
            title="Happening now"
            liveEvents={liveAll}
            upcomingEvents={upcomingAll}
            onAddToSchedule={addToPersonalSchedule}
            onRemoveFromSchedule={removeFromPersonalSchedule}
          />
          <Panel
            title="Your schedule"
            liveEvents={livePersonal}
            upcomingEvents={upcomingPersonal}
            onAddToSchedule={addToPersonalSchedule}
            onRemoveFromSchedule={removeFromPersonalSchedule}
          />
        </div>
      </section>
    </div>
  );
}
