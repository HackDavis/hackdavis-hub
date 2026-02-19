import { pageFilters } from '@typeDefs/filters';
import { ScheduleFilter } from '@typeDefs/filters';

const FILTER_BUTTON_BG_DEFAULT = '#F3F3FC';
const FILTER_BUTTON_TEXT_DEFAULT = '#3F3F3F';
const FILTER_BUTTON_BG_SELECTED = '#3F3F3F';
const FILTER_BUTTON_TEXT_SELECTED = '#FAFAFF';

interface FiltersProps {
  activeFilters: ScheduleFilter[];
  toggleFilter: (label: ScheduleFilter) => void;
}

export default function Filters({ activeFilters, toggleFilter }: FiltersProps) {
  return (
    <div className="px-[calc(100vw*32/375)] md:px-0 flex gap-4 mt-[28px] overflow-x-scroll no-scrollbar">
      {pageFilters.map((filter) => (
        <button
          key={filter.label}
          onClick={() => toggleFilter(filter.label)}
          type="button"
          className={`
          relative flex w-[163px] h-[45px] px-[38px] py-[13px]
          justify-center items-center
          rounded-[22.5px]
          font-jakarta text-sm sm:text-[16px] font-semibold leading-[100%] tracking-[0.32px]
          transition-all duration-200
        `}
          style={{
            backgroundColor: activeFilters.includes(filter.label)
              ? FILTER_BUTTON_BG_SELECTED
              : FILTER_BUTTON_BG_DEFAULT,
            color: activeFilters.includes(filter.label)
              ? FILTER_BUTTON_TEXT_SELECTED
              : FILTER_BUTTON_TEXT_DEFAULT,
          }}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
