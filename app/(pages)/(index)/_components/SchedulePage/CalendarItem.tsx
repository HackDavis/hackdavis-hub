import React from 'react';
import Image from 'next/image';

type EventType = 'GENERAL' | 'ACTIVITIES' | 'WORKSHOP' | 'MENU';

interface CalendarItemProps {
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

const getBgColor = (type: EventType): string => {
  const colors = {
    GENERAL: 'rgba(158, 231, 229, 0.5)', // #9EE7E5
    ACTIVITIES: 'rgba(255, 197, 171, 0.5)', // #FFC5AB
    WORKSHOP: 'rgba(175, 209, 87, 0.5)', // #AFD157
    MENU: 'rgba(255, 197, 61, 0.5)', // #FFC53D
  };
  return colors[type];
};

const formatTime = (timeStr: string): string => {
  const date = new Date(timeStr);
  // Convert to PST
  const pstDate = new Date(
    date.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })
  );
  return pstDate.toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

const CalendarItem: React.FC<CalendarItemProps> = ({
  title,
  type,
  startTime,
  endTime,
  location,
}) => {
  const bgColor = getBgColor(type);
  const timeDisplay =
    startTime === endTime
      ? formatTime(startTime)
      : `${formatTime(startTime)} - ${formatTime(endTime)}`;

  return (
    <div
      className="tw-w-full tw-h-[133px] tw-flex-shrink-0 tw-rounded-[16px] tw-px-[42px] tw-mt-[48px] tw-flex tw-flex-col tw-justify-center"
      style={{ backgroundColor: bgColor }}
    >
      <h2 className="tw-text-black tw-font-metropolis tw-text-[36px] tw-font-bold tw-leading-[40px] tw-tracking-[0.72px] tw-mb-2">
        {title}
      </h2>
      <div className="tw-flex tw-items-center tw-gap-2">
        <span className="tw-text-black tw-font-plus-jakarta-sans tw-text-[18px] tw-font-normal tw-leading-[145%] tw-tracking-[0.36px]">
          {timeDisplay}
        </span>
        {location && (
          <>
            <Image
              src="/index/schedule/location.svg"
              alt="location icon"
              width={11}
              height={13.44}
              className="tw-mx-2"
            />
            <span className="tw-text-black tw-font-plus-jakarta-sans tw-text-[18px] tw-font-normal tw-leading-[145%] tw-tracking-[0.36px]">
              {location}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default CalendarItem;
