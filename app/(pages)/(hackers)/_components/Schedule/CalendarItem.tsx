import React from 'react';
import Image from 'next/image';
import Event, { EventTag, EventType } from '@typeDefs/event';
import { Button } from '@pages/_globals/components/ui/button';
import { SCHEDULE_EVENT_STYLES } from './scheduleEventStyles';
import { formatScheduleTimeRange } from './scheduleTime';

interface CalendarItemProps {
  event: Event & { originalType?: string };
  attendeeCount?: number;
  inPersonalSchedule?: boolean;
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
  inPersonalSchedule = false,
  tags,
  host,
  onAddToSchedule,
  onRemoveFromSchedule,
}: CalendarItemProps) {
  const { name, type, location, start_time, end_time } = event;
  // Use originalType when present, but guard against unexpected values.
  const rawType = event.originalType ?? type ?? '';
  const normalizedType = rawType.toUpperCase();
  const displayType: EventType = isEventType(normalizedType)
    ? normalizedType
    : 'GENERAL';
  const eventStyle = SCHEDULE_EVENT_STYLES[displayType];

  // Handle different time display scenarios
  const timeDisplay = formatScheduleTimeRange(
    new Date(start_time),
    end_time ? new Date(end_time) : undefined
  );

  return (
    <div
      className={`w-full py-[24px] flex-shrink-0 rounded-[16px] px-[20px] 2xs:px-[38px] 2xs:py-[24px] lg:px-[40px] lg:py-[32px] mb-[16px] flex ${
        displayType === 'ACTIVITIES' ? 'flex-row' : 'flex-col justify-center'
      }`}
      style={{
        backgroundColor: eventStyle.bgColor,
        color: eventStyle.textColor,
      }}
    >
      <div
        className={`flex items-start justify-between sm:items-center gap-4 relative ${
          displayType === 'ACTIVITIES'
            ? 'w-full flex-col sm:flex-row'
            : 'flex-col'
        }`}
      >
        <div
          className={`flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-6 ${
            // top
            displayType !== 'ACTIVITIES' ? 'w-full' : ''
          }`}
        >
          <div className="w-full sm:w-auto">
            <h2 className="font-metropolis text-xl sm:text-2xl font-semibold tracking-[0.72px] sm:mb-2 text-balance">
              {name}
            </h2>
            <div className="flex items-center flex-wrap gap-y-2">
              <span className="font-plus-jakarta-sans text-xs xs:text-sm md:text-base lg:text-lg font-normal leading-[145%] tracking-[0.36px] mr-5">
                {timeDisplay}
                {displayType === 'MEALS' && ' (Subject to change)'}
              </span>
              {location && (
                <div className="flex items-center">
                  <Image
                    src="/index/schedule/location.svg"
                    alt="location icon"
                    width={11}
                    height={13.44}
                    className="mr-1"
                  />
                  <span className="font-plus-jakarta-sans text-xs xs:text-sm md:text-base lg:text-lg font-normal leading-[145%] tracking-[0.36px]">
                    {location}
                  </span>
                </div>
              )}
            </div>
            {tags && tags.length > 0 && (
              <div className="flex gap-2 items-center sm:py-2 flex-wrap mt-2">
                {tags.map((tag) => (
                  <div
                    className="px-3 py-1.5 border rounded-md"
                    style={{ borderColor: eventStyle.textColor }}
                    key={tag}
                  >
                    <span
                      key={tag}
                      className="font-plus-jakarta-sans text-sm font-normal leading-[145%] tracking-[0.36px]"
                    >
                      {tag.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {displayType !== 'GENERAL' && displayType !== 'MEALS' && (
            <div className="flex flex-col gap-2 items-end text-right pt-1">
              {host && (
                <span className="font-plus-jakarta-sans text-xs xs:text-sm md:text-base lg:text-lg font-normal leading-[145%] tracking-[0.36px] text-balance">
                  {host}
                </span>
              )}
            </div>
          )}
        </div>
        {displayType !== 'GENERAL' && displayType !== 'MEALS' && (
          <div
            className={`flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6 w-full ${
              //bottom
              displayType !== 'ACTIVITIES' ? '' : 'sm:w-auto'
            }`}
          >
            {displayType === 'WORKSHOPS' && (
              <div
                className={`flex gap-2 items-center w-full sm:w-auto ${
                  attendeeCount && attendeeCount > 0
                    ? 'visible'
                    : 'hidden sm:invisible sm:flex'
                }
              
                  `}
              >
                <div className="relative w-16 h-12">
                  <Image
                    src="/index/schedule/attendee.svg"
                    alt="location icon"
                    fill
                  />
                </div>
                <span className="font-plus-jakarta-sans text-xs xs:text-sm md:text-base lg:text-lg font-normal leading-[145%] tracking-[0.36px] text-balance">
                  {`${attendeeCount ?? ''} Hacker${
                    attendeeCount && attendeeCount < 2 ? ' is' : 's are'
                  } attending this event`}
                </span>
              </div>
            )}

            <div className="flex flex-col gap-2 items-end w-full sm:w-auto">
              <Button
                onClick={
                  inPersonalSchedule ? onRemoveFromSchedule : onAddToSchedule
                }
                className="w-full sm:w-32 px-8 py-2 rounded-3xl cursor-pointer relative shrink-0"
                style={{
                  backgroundColor:
                    eventStyle.addButtonColor || 'rgba(0, 0, 0, 0)',
                  color: eventStyle.textColor,
                }}
                variant="ghost"
              >
                <p className="font-semibold relative z-10 inline-flex items-center gap-2">
                  <span
                    aria-hidden
                    className="inline-block w-4 h-4"
                    style={{
                      backgroundColor: 'currentColor',
                      WebkitMaskImage: `url(${
                        inPersonalSchedule
                          ? '/icons/check.svg'
                          : '/icons/plus.svg'
                      })`,
                      WebkitMaskRepeat: 'no-repeat',
                      WebkitMaskPosition: 'center',
                      WebkitMaskSize: 'contain',
                      maskImage: `url(${
                        inPersonalSchedule
                          ? '/icons/check.svg'
                          : '/icons/plus.svg'
                      })`,
                      maskRepeat: 'no-repeat',
                      maskPosition: 'center',
                      maskSize: 'contain',
                    }}
                  />
                  {inPersonalSchedule ? 'Added' : 'Add'}
                </p>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CalendarItem;
