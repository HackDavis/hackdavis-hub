import Image from 'next/image';
import { pageFilters, ScheduleFilter } from '@typeDefs/filters';
import { useEffect, useState } from 'react';
import DayNavButtons from './DayNavButtons';
import Filters from './Filters';
import { DayKey } from './constants';

const MOBILE_FILTER_BG_DEFAULT = '#F3F3FC';
const MOBILE_FILTER_TEXT_DEFAULT = '#3F3F3F';
const MOBILE_FILTER_BG_SELECTED = '#3F3F3F';
const MOBILE_FILTER_TEXT_SELECTED = '#FAFAFF';

interface ScheduleControlsProps {
  activeDay: DayKey;
  changeActiveDay: (day: DayKey) => void;
  activeFilters: ScheduleFilter[];
  toggleFilter: (label: ScheduleFilter) => void;
  isMobileFilterOpen: boolean;
  setIsMobileFilterOpen: (
    value: boolean | ((prev: boolean) => boolean)
  ) => void;
}

export default function ScheduleControls({
  activeDay,
  changeActiveDay,
  activeFilters,
  toggleFilter,
  isMobileFilterOpen,
  setIsMobileFilterOpen,
}: ScheduleControlsProps) {
  const hasSelectedFilters = activeFilters.some((filter) => filter !== 'ALL');
  const selectedFilterDots = activeFilters.filter((filter) => filter !== 'ALL');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 110);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className="md:hidden sticky top-10 z-20">
        <div className="flex items-start justify-between gap-4">
          <div
            className={`transition-all duration-300 ${
              isScrolled && !isMobileFilterOpen
                ? 'opacity-0 pointer-events-none -translate-x-4'
                : 'opacity-100'
            }`}
          >
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
          </div>

          {!isMobileFilterOpen && (
            <DayNavButtons
              activeDay={activeDay}
              onSelectDay={changeActiveDay}
              className="shrink-0 h-[45px] flex flex-row gap-8 items-center bg-[#FAFAFA]/80 rounded-[30px]"
              buttonClassName="text-base"
            />
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

      <div className="hidden md:contents">
        <div className="min-w-0 flex-1 md:col-start-2 md:row-start-2 md:mt-8">
          <Filters toggleFilter={toggleFilter} activeFilters={activeFilters} />
        </div>

        <div className="shrink-0 md:col-start-1 md:row-start-2 md:mt-8 sticky top-20">
          <DayNavButtons
            activeDay={activeDay}
            onSelectDay={changeActiveDay}
            className="flex flex-col gap-2 items-start"
          />
        </div>
      </div>
    </>
  );
}
