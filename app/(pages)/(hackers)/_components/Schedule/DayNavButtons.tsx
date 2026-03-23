import { useState } from 'react';
import { DAY_KEYS, DAY_LABELS, DayKey } from './constants';

interface DayNavButtonsProps {
  activeDay: DayKey;
  onSelectDay: (day: DayKey) => void;
  className?: string;
  buttonClassName?: string;
}

export default function DayNavButtons({
  activeDay,
  onSelectDay,
  className,
  buttonClassName,
}: DayNavButtonsProps) {
  const [hoveredDay, setHoveredDay] = useState<DayKey | null>(null);
  const previewDay =
    hoveredDay && hoveredDay !== activeDay ? hoveredDay : activeDay;

  return (
    <div className={className}>
      {DAY_KEYS.map((dayKey) => (
        <button
          key={dayKey}
          onClick={() => onSelectDay(dayKey)}
          onMouseEnter={() => setHoveredDay(dayKey)}
          onMouseLeave={() => setHoveredDay(null)}
          onFocus={() => setHoveredDay(dayKey)}
          onBlur={() => setHoveredDay(null)}
          type="button"
          className={`relative w-fit bg-transparent border-none p-0 text-left font-dm-mono text-base md:text-lg font-medium tracking-[0.36px] leading-[100%] inline-flex items-center ${
            activeDay === dayKey ? 'text-[#3F3F3F]' : 'text-[#ACACB9]'
          } ${buttonClassName ?? ''}`}
        >
          <span
            className={`hidden md:block absolute left-0 top-1/2 -translate-y-1/2 origin-left transition-all duration-200 ease-out ${
              previewDay === dayKey
                ? 'scale-x-100 opacity-100'
                : 'scale-x-0 opacity-0'
            }`}
            aria-hidden
          >
            {'\u2022'}
          </span>
          <span className="font-dm-mono pl-5">{DAY_LABELS[dayKey]}</span>
        </button>
      ))}
    </div>
  );
}
