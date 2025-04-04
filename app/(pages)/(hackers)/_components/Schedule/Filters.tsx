import { pageFilters } from '@typeDefs/filters';
import { EventType } from '@typeDefs/event';

interface FiltersProps {
  activeFilters: EventType[];
  toggleFilter: (label: EventType) => void;
}

export default function Filters({ activeFilters, toggleFilter }: FiltersProps) {
  return (
    <div className="px-[calc(100vw*32/375)] md:px-0 flex gap-4 mt-[28px] overflow-x-scroll no-scrollbar">
      {pageFilters.map((filter) => (
        <button
          key={filter.label}
          onClick={() => toggleFilter(filter.label)}
          className={`
          relative flex w-[163px] h-[45px] px-[38px] py-[13px]
          justify-center items-center
          rounded-[22.5px] border-[1.5px]
          font-jakarta text-[16px] font-semibold leading-[100%] tracking-[0.32px]
          text-[#123041] transition-all duration-200
          ${
            activeFilters.includes(filter.label)
              ? `border-solid`
              : 'border-dashed hover:bg-opacity-50'
          }
        `}
          style={{
            borderColor: filter.color,
            backgroundColor: activeFilters.includes(filter.label)
              ? filter.color
              : 'transparent',
          }}
          onMouseEnter={(e) => {
            if (!activeFilters.includes(filter.label)) {
              e.currentTarget.style.backgroundColor = filter.color + '80'; // 80 is 50% opacity in hex
            }
          }}
          onMouseLeave={(e) => {
            if (!activeFilters.includes(filter.label)) {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
