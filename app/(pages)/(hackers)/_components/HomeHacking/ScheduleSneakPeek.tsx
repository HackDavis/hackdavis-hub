'use client';

import Link from 'next/link';
import Image from 'next/image';
import CalendarItem from '@pages/(hackers)/_components/Schedule/CalendarItem';
import {
  EventEntry,
  useScheduleSneakPeekData,
} from '../../../_hooks/useScheduleSneakPeekData';

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
          <p className="font-jakarta text-sm text-[#7C7C85] mt-[1vw]">
            No events happening right now.
          </p>
        )}
      </div>

      <SectionLabel label="IN 0:30:00" />
      <div className="space-y-3">
        {upcomingEvents.length > 0 ? (
          renderEventItems(upcomingEvents, 'upcoming')
        ) : (
          <p className="font-jakarta text-sm text-[#7C7C85] mt-3">
            No events starting in the next 30 minutes.
          </p>
        )}
      </div>
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
    <div className="w-full bg-[#FAFAFF]">
      <section className={`w-[90%] mx-auto py-[5vw] ${className ?? ''}`}>
        <div className="inline-flex items-center group font-jakarta text-[clamp(1.25rem,4.2vw,3rem)] font-semibold leading-tight tracking-[0.72px] text-[#3F3F3F] whitespace-nowrap">
          <span className="w-0 group-hover:w-[26px] overflow-hidden transition-all duration-300 ease-out shrink-0">
            <Image
              src="/icons/arrow-right.svg"
              alt=""
              width={26}
              height={26}
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
