import React from 'react';
import Image from 'next/image';

type EventType = 'GENERAL' | 'ACTIVITIES' | 'WORKSHOP' | 'MENU';

interface CalendarItemProps {
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

  // Handle different time display scenarios
  let timeDisplay;
  if (!endTime) {
    timeDisplay = formatTime(startTime);
  } else if (startTime === endTime) {
    timeDisplay = formatTime(startTime);
  } else {
    timeDisplay = `${formatTime(startTime)} - ${formatTime(endTime)}`;
  }

  return (
    <div
      className="w-full py-[24px] flex-shrink-0 rounded-[16px] px-[40px] mb-[16px] flex flex-col justify-center"
      style={{ backgroundColor: bgColor }}
    >
      <h2 className="text-black font-metropolis text-[28px] font-semibold leading-[40px] tracking-[0.72px]">
        {title}
      </h2>
      <div className="flex items-center">
        <span className="text-black font-plus-jakarta-sans text-[18px] font-normal leading-[145%] tracking-[0.36px] mr-[16px]">
          {timeDisplay}
        </span>
        {location && (
          <div className="flex items-center">
            <Image
              src="/index/schedule/location.svg"
              alt="location icon"
              width={11}
              height={13.44}
              className="mr-2"
            />
            <span className="text-black font-plus-jakarta-sans text-[18px] font-normal leading-[145%] tracking-[0.36px]">
              {location}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarItem;
