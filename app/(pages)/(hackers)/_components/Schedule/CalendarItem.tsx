import React from 'react';
import Image from 'next/image';
import { EventType } from '@typeDefs/event';
import { pageFilters } from '@typeDefs/filters';
import { Button } from '@pages/_globals/components/ui/button';

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
  const { name, type, location, start_time, end_time } = event;
  const bgColor = getBgColor(type);

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
      <div className="flex justify-between items-center flex-col sm:flex-row gap-4 sm:gap-0">
        <div>
          <h2 className="text-black font-metropolis text-xl sm:text-2xl font-semibold leading-[40px] tracking-[0.72px] mb-2">
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
          </div>
          {attendeeCount && attendeeCount > 0 && (
            <div className="flex gap-2 items-center">
              <div className="relative w-12 h-12">
                <Image
                  src="/index/schedule/attendee.svg"
                  alt="location icon"
                  fill
                />
              </div>
              <span className="text-black font-plus-jakarta-sans text-xs xs:text-sm md:text-base lg:text-lg font-normal leading-[145%] tracking-[0.36px]">
                {attendeeCount} Hackers are attending this event
              </span>
            </div>
          )}
        </div>

        {event.type !== 'GENERAL' && (
          <Button
            onClick={
              inPersonalSchedule ? onRemoveFromSchedule : onAddToSchedule
            }
            className={`w-full sm:w-32 px-8 py-2 border-2 border-black rounded-3xl border-dashed hover:border-solid cursor-pointer relative group`}
            variant="ghost"
          >
            <div
              className={`absolute inset-0 rounded-3xl transition-all duration-300 ease-out cursor-pointer bg-black w-0 group-hover:w-full`}
            />
            <p
              className={`font-semibold relative z-10 transition-colors duration-300 text-black group-hover:text-white`}
            >
              {inPersonalSchedule ? 'Remove' : 'Add'}
            </p>
          </Button>
        )}
      </div>
    </div>
  );
}

export default CalendarItem;
