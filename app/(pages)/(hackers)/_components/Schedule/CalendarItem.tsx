import React from 'react';
import Image from 'next/image';
import Event, { EventTag, EventType } from '@typeDefs/event';
// import { Button } from '@pages/_globals/components/ui/button';
import { SCHEDULE_EVENT_STYLES } from './scheduleEventStyles';
import { formatScheduleTimeRange } from './scheduleTime';

import location_icon from 'public/hackers/schedule/location.svg';
import attendee_icon from 'public/hackers/schedule/attendee-cow.svg';

interface CalendarItemProps {
  event: Event & { originalType?: string };
  attendeeCount?: number;
  inPersonalSchedule?: boolean;
  hideAddButton?: boolean;
  disableAddButton?: boolean;
  onAddToSchedule?: () => void;
  onRemoveFromSchedule?: () => void;
  isRecommended?: boolean;
  tags?: EventTag[];
  host?: string;
}

const isEventType = (value: string): value is EventType => {
  return value in SCHEDULE_EVENT_STYLES;
};

export function CalendarItem({
  event,
  attendeeCount,
  // inPersonalSchedule = false,
  // hideAddButton = false,
  // disableAddButton = false,
  // onAddToSchedule,
  // onRemoveFromSchedule,
  tags,
  host,
}: CalendarItemProps) {
  const { name, type, location, start_time, end_time } = event;
  // Use originalType when present, but guard against unexpected values.
  const rawType = event.originalType ?? type ?? '';
  const normalizedType = rawType.toUpperCase();
  const displayType: EventType = isEventType(normalizedType)
    ? normalizedType
    : 'GENERAL';
  const eventStyle = SCHEDULE_EVENT_STYLES[displayType];
  // const actionIconPath = inPersonalSchedule
  //   ? '/icons/check.svg'
  //   : '/icons/plus.svg';

  // Handle different time display scenarios
  const timeDisplay = formatScheduleTimeRange(
    new Date(start_time),
    end_time ? new Date(end_time) : undefined
  );

  return (
    <div
      className="w-full flex-shrink-0 rounded-[16px] px-[22px] py-[22px] mb-[8px] flex flex-col justify-center"
      style={{
        backgroundColor: eventStyle.bgColor,
        color: eventStyle.textColor,
      }}
    >
      <div className="flex items-start justify-between sm:items-center gap-[10px] relative flex-col">
        {/* Name and Host in two columns */}
        <div className="flex flex-row justify-between items-start w-full">
          <h2 className="font-metropolis text-[32px] font-semibold tracking-[0.72px] text-balance w-[65%]">
            {name}
          </h2>
          {displayType !== 'GENERAL' && displayType !== 'MEALS' && host && (
            <div className="flex flex-col gap-2 items-end text-right pt-1 w-[35%]">
              <span className="font-plus-jakarta-sans text-[24px] font-normal leading-[145%] tracking-[0.36px] text-balance">
                {host.toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Time, Location, Tags below */}
        <div className="flex items-center flex-wrap gap-y-2 w-full">
          <span className="font-plus-jakarta-sans text-[26px] font-normal leading-[145%] tracking-[0.36px] mr-5">
            {timeDisplay}
            {displayType === 'MEALS' && ' (Subject to change)'}
          </span>
          {location && (
            <div className="flex items-center">
              <Image
                src={location_icon}
                alt="location icon"
                width={11}
                height={13.44}
                className="mr-1"
              />
              <span className="font-plus-jakarta-sans text-[24px] font-normal leading-[145%] tracking-[0.36px]">
                {location}
              </span>
            </div>
          )}
        </div>
        {tags && tags.length > 0 && (
          <div className="flex gap-2 items-center flex-wrap mt-[8px] justify-start w-full">
            {tags.map((tag) => (
              <div
                className="px-[8px] py-[4px] bg-[rgba(209,247,110,0.60)]"
                key={tag}
              >
                <span
                  key={tag}
                  className="font-dm-mono text-xl font-normal leading-[145%] tracking-[0.36px]"
                >
                  {tag.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Attendee count */}
        {displayType !== 'GENERAL' && displayType !== 'MEALS' && (
          <div className="flex flex-row justify-between items-center gap-2 sm:gap-6 w-full">
            {(displayType === 'WORKSHOPS' || displayType === 'ACTIVITIES') && (
              <div
                className={`flex gap-2 items-center w-full sm:w-auto ${
                  attendeeCount && attendeeCount > 0
                    ? 'visible'
                    : 'hidden sm:invisible sm:flex'
                }
              
                  `}
              >
                <div className="relative w-[44.4px] h-[30px]">
                  <Image src={attendee_icon} alt="attendee icon" fill />
                </div>
                <span className="font-plus-jakarta-sans text-[22px] font-normal leading-[145%] tracking-[0.36px] text-balance">
                  {`${attendeeCount ?? ''} Hacker${
                    attendeeCount && attendeeCount < 2 ? ' is' : 's are'
                  } attending`}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CalendarItem;
