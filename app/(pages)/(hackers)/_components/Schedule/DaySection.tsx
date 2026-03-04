import { Button } from '@pages/_globals/components/ui/button';
import CalendarItem from './CalendarItem';
import { DAY_LABELS, DayKey } from './constants';
import { GroupedDayEntries } from './types';

interface DaySectionProps {
  dayKey: DayKey;
  entries: GroupedDayEntries;
  activeTab: 'schedule' | 'personal';
  onSwitchToScheduleTab: () => void;
  onAddToSchedule: (eventId: string) => void;
  onRemoveFromSchedule: (eventId: string) => void;
}

export default function DaySection({
  dayKey,
  entries,
  activeTab,
  onSwitchToScheduleTab,
  onAddToSchedule,
  onRemoveFromSchedule,
}: DaySectionProps) {
  const dayTitle = DAY_LABELS[dayKey].replace(/^MAY/, 'May');

  return (
    <section
      id={`day-${dayKey}`}
      className="scroll-mt-24 mb-8 last:mb-0 bg-white rounded-[16px] p-4 md:p-6"
    >
      <div className="font-jakarta font-bold text-[clamp(2rem,5vw,2.75rem)] leading-normal tracking-[0.96px] text-[#3F3F3F]">
        {dayTitle}
      </div>
      <div className="w-[90%] border-b border-[#E9E9E7] mt-3 mb-6" />

      {entries.length > 0 ? (
        entries.map(([timeKey, events]) => (
          <div
            key={`${dayKey}-${timeKey}`}
            className="relative mb-[24px] last:mb-0"
          >
            <div className="font-dm-mono text-sm md:text-lg font-normal leading-[145%] tracking-[0.36px] text-[#7C7C85] mt-[16px] mb-[6px]">
              {timeKey}
            </div>
            <div>
              {events.map((eventDetail) => (
                <CalendarItem
                  key={`${dayKey}-${eventDetail.event._id}`}
                  event={eventDetail.event}
                  attendeeCount={eventDetail.attendeeCount}
                  inPersonalSchedule={eventDetail.inPersonalSchedule}
                  tags={eventDetail.event.tags}
                  host={eventDetail.event.host}
                  onAddToSchedule={() =>
                    onAddToSchedule(eventDetail.event._id || '')
                  }
                  onRemoveFromSchedule={() =>
                    onRemoveFromSchedule(eventDetail.event._id || '')
                  }
                />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-10">
          {activeTab === 'personal' ? (
            <div>
              <p className="mb-4">No events in your personal schedule yet.</p>
              <Button
                onClick={onSwitchToScheduleTab}
                className="w-full sm:w-fit px-8 py-2 border-2 border-black rounded-3xl border-dashed hover:border-solid cursor-pointer relative group"
                variant="ghost"
              >
                <div className="absolute inset-0 rounded-3xl transition-all duration-300 ease-out cursor-pointer bg-black w-0 group-hover:w-full" />
                <p className="font-semibold relative z-10 transition-colors duration-300 text-black group-hover:text-white">
                  Browse the schedule to add events
                </p>
              </Button>
            </div>
          ) : (
            'No events found for this day and filter(s).'
          )}
        </div>
      )}
    </section>
  );
}
