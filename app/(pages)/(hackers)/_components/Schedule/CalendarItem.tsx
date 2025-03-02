import React from 'react';
import Image from 'next/image';

type EventType = 'general' | 'activity' | 'workshop' | 'meal';

interface CalendarItemProps {
  id: number;
  name: string;
  type: EventType;
  start_time: string;
  end_time?: string;
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
    general: 'rgba(158, 231, 229, 0.5)', // #9EE7E5
    activity: 'rgba(255, 197, 171, 0.5)', // #FFC5AB
    workshop: 'rgba(175, 209, 87, 0.5)', // #AFD157
    meal: 'rgba(255, 197, 61, 0.5)', // #FFC53D
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
  name,
  type,
  start_time,
  end_time,
  location,
}) => {
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
      </div>
    </div>
  );
};

export default CalendarItem;
