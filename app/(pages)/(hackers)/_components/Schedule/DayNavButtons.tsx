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
  return (
    <div className={className}>
      {DAY_KEYS.map((dayKey) => (
        <button
          key={dayKey}
          onClick={() => onSelectDay(dayKey)}
          type="button"
          className={`w-fit bg-transparent border-none p-0 text-left font-dm-mono text-base md:text-lg font-medium tracking-[0.36px] leading-[100%] inline-flex items-center ${
            activeDay === dayKey ? 'text-[#3F3F3F]' : 'text-[#ACACB9]'
          } ${buttonClassName ?? ''}`}
        >
          {activeDay === dayKey && (
            <span className="mr-2" aria-hidden>
              {'\u2022'}
            </span>
          )}
          <span className="font-dm-mono">{DAY_LABELS[dayKey]}</span>
        </button>
      ))}
    </div>
  );
}
