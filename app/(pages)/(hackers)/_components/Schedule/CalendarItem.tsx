import React from 'react';
import Image from 'next/image';
import { EventType } from '@typeDefs/event';
import { pageFilters } from '@typeDefs/filters';

const getBgColor = (type: EventType): string => {
  const color =
    pageFilters.find((f) => f.label === type)?.color || 'rgba(0, 0, 0, 0)';

  return color.replace('1)', '0.5)');
};

const formatTime = (pstDate: Date): string => {
  return pstDate.toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

interface CalendarItemProps {
  event: any;
  attendeeCount?: number;
  inPersonalSchedule?: boolean;
  onAddToSchedule?: () => void;
  onRemoveFromSchedule?: () => void;
}

export function CalendarItem({
  event,
  attendeeCount,
  inPersonalSchedule = false,
  onAddToSchedule,
  onRemoveFromSchedule,
}: CalendarItemProps) {
  const { name, host, type, location, start_time, end_time } = event;
  const bgColor = getBgColor(type);

  // TODO: add host and attendee count and other UI elements
  console.log(host, attendeeCount);

  // Handle different time display scenarios
  let timeDisplay;
  if (!end_time) {
    timeDisplay = formatTime(start_time);
  } else if (start_time === end_time) {
    timeDisplay = formatTime(start_time);
  } else {
    timeDisplay = `${formatTime(start_time).slice(0, -2)} - ${formatTime(
      end_time
    )}`;
  }

  return (
    <div
      className="w-full py-[24px] flex-shrink-0 rounded-[16px] px-[20px] lg:px-[40px] mb-[16px] flex flex-col justify-center"
      style={{ backgroundColor: bgColor }}
    >
      <h2 className="text-black font-metropolis text-2xl font-semibold leading-[40px] tracking-[0.72px]">
        {name}
      </h2>
      <div className="flex items-center">
        <span className="text-black font-plus-jakarta-sans text-xs xs:text-sm md:text-base lg:text-lg font-normal leading-[145%] tracking-[0.36px] mr-2 xs:mr-3 md:mr-4 lg:mr-5">
          {timeDisplay}
        </span>
        {location && (
          <div className="flex items-center">
            <Image
              src="/index/schedule/location.svg"
              alt="location icon"
              width={11}
              height={13.44}
              className="mr-2 xs:mr-3 md:mr-4 lg:mr-5"
            />
            <span className="text-black font-plus-jakarta-sans text-xs xs:text-sm md:text-base lg:text-lg font-normal leading-[145%] tracking-[0.36px]">
              {location}
            </span>
          </div>
        )}
        <button
          onClick={inPersonalSchedule ? onRemoveFromSchedule : onAddToSchedule}
          className="ml-auto flex items-center justify-center px-3 py-1 rounded-md text-sm font-medium text-white bg-[#00C4D7] hover:bg-[#00A3B3] transition-colors"
        >
          {inPersonalSchedule ? 'Remove' : 'Add to Schedule'}
        </button>
      </div>
    </div>
  );
}

export default CalendarItem;
