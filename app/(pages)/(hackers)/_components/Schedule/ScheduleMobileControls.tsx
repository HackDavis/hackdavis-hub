import Image from 'next/image';
import { pageFilters, ScheduleFilter } from '@typeDefs/filters';

const MOBILE_FILTER_BG_DEFAULT = '#F3F3FC';
const MOBILE_FILTER_TEXT_DEFAULT = '#3F3F3F';
const MOBILE_FILTER_BG_SELECTED = '#3F3F3F';
const MOBILE_FILTER_TEXT_SELECTED = '#FAFAFF';

interface ScheduleMobileControlsProps {
  activeDay: '19' | '20'; //still using old days so i can still see events in db
  changeActiveDay: (day: '19' | '20') => void;
  activeFilters: ScheduleFilter[];
  toggleFilter: (label: ScheduleFilter) => void;
  isMobileFilterOpen: boolean;
  setIsMobileFilterOpen: (
    value: boolean | ((prev: boolean) => boolean)
  ) => void;
}

export default function ScheduleMobileControls({
  activeDay,
  changeActiveDay,
  activeFilters,
  toggleFilter,
  isMobileFilterOpen,
  setIsMobileFilterOpen,
}: ScheduleMobileControlsProps) {
  const hasSelectedFilters = activeFilters.some((filter) => filter !== 'ALL');
  const selectedFilterDots = activeFilters.filter((filter) => filter !== 'ALL');

  const renderDayButton = (day: '19' | '20', label: string) => (
    <button
      onClick={() => changeActiveDay(day)}
      type="button"
      className={`w-fit bg-transparent border-none p-0 text-left font-dm-mono text-base font-medium tracking-[0.36px] leading-[100%] inline-flex items-center ${
        activeDay === day ? 'text-[#3F3F3F]' : 'text-[#ACACB9]'
      }`}
    >
      {activeDay === day && (
        <span className="mr-2" aria-hidden>
          {'\u2022'}
        </span>
      )}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="md:hidden">
      <div className="flex items-start justify-between gap-4">
        <button
          onClick={() => setIsMobileFilterOpen((prev) => !prev)}
          type="button"
          className={`relative inline-flex w-fit min-w-[52px] h-[45px] px-3 py-[13px] justify-center items-center rounded-[22.5px] font-jakarta text-sm font-semibold leading-[100%] tracking-[0.32px] transition-all duration-200 shrink-0 ${
            isMobileFilterOpen || hasSelectedFilters
              ? 'bg-[#3F3F3F]'
              : 'bg-[#F3F3FC]'
          }`}
        >
          <Image
            src={
              isMobileFilterOpen
                ? '/icons/white_x.svg'
                : '/icons/hamburger_filter.svg'
            }
            alt={isMobileFilterOpen ? 'Close filters' : 'Open filters'}
            width={16}
            height={16}
            className={
              !isMobileFilterOpen && hasSelectedFilters ? 'invert' : ''
            }
          />
          {selectedFilterDots.length > 0 && (
            <span className="flex items-center gap-1.5 ml-2">
              {selectedFilterDots.map((filter) => {
                const color = pageFilters.find((f) => f.label === filter)
                  ?.color;
                return (
                  <span
                    key={`mobile-filter-dot-${filter}`}
                    className="w-2.5 h-2.5 rounded-full border"
                    style={{
                      backgroundColor: color,
                      borderColor: color,
                    }}
                  />
                );
              })}
            </span>
          )}
        </button>

        {!isMobileFilterOpen && (
          <div className="shrink-0 h-[45px] flex flex-row gap-8 items-center">
            {renderDayButton('19', 'MAY 9')}
            {renderDayButton('20', 'MAY 10')}
          </div>
        )}
      </div>

      {isMobileFilterOpen && (
        <div className="mt-4 w-full flex flex-col gap-3">
          {pageFilters.map((filter) => (
            <button
              key={`mobile-filter-${filter.label}`}
              onClick={() => toggleFilter(filter.label)}
              type="button"
              className="relative flex w-full h-[45px] px-4 py-[13px] justify-center items-center rounded-[22.5px] font-jakarta text-sm font-semibold leading-[100%] tracking-[0.32px] transition-all duration-200"
              style={{
                backgroundColor: activeFilters.includes(filter.label)
                  ? filter.label === 'ALL'
                    ? MOBILE_FILTER_BG_SELECTED
                    : filter.color
                  : MOBILE_FILTER_BG_DEFAULT,
                color: activeFilters.includes(filter.label)
                  ? filter.label === 'ALL'
                    ? MOBILE_FILTER_TEXT_SELECTED
                    : MOBILE_FILTER_TEXT_DEFAULT
                  : MOBILE_FILTER_TEXT_DEFAULT,
              }}
            >
              {filter.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
