'use client';

import { Button } from '@globals/components/ui/button';
import { allTracks, TrackData } from '@data/tracks';
import PrizeGrid from './PrizeGrid';
import { useState, useRef, useEffect } from 'react';

const prizes = Object.values(allTracks);

export default function PrizeTracks() {
  const [filter, setFilter] = useState<string>('all');
  const [filteredPrizes, setFilteredPrizes] = useState<TrackData[]>(prizes);

  const handleFilterChange = (selectedFilter: string) => {
    setFilter(selectedFilter.toLowerCase());
    setFilteredPrizes(() => {
      if (selectedFilter.toLowerCase() === 'all') {
        return prizes;
      }
      return prizes.filter(
        (prize) => prize.filter.toLowerCase() === selectedFilter.toLowerCase()
      );
    });
  };

  return (
    <main className="flex flex-col gap-4 p-[20px] xs:p-[48px] lg:p-[64px] xl:p-[120px] pt-0 xs:pt-0 lg:pt-0 xl:pt-0">
      <Header />
      <FilterRow currentFilter={filter} onFilterChange={handleFilterChange} />
      <div className="flex items-center justify-center w-full mt-8">
        <PrizeGrid items={filteredPrizes} />
      </div>
    </main>
  );
}

function Header() {
  return (
    <div className="flex flex-col mt-16">
      <h6 className="tracking-widest text-sm text-gray-500">
        YOUR NEXT REWARD
      </h6>
      <h3 className="font-medium text-4xl font-metropolis mt-4">
        Prize Tracks
      </h3>
    </div>
  );
}

interface FilterRowProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
}

const filters = [
  'ALL',
  'GENERAL',
  'TECHNICAL',
  'DESIGN',
  'BUSINESS',
  'SPONSOR',
  'NON-PROFIT',
];

function FilterRow({ currentFilter, onFilterChange }: FilterRowProps) {
  return (
    <>
      {/* Desktop: inline buttons */}
      <div className="hidden md:flex gap-4">
        {filters.map((track) => {
          const isActive = currentFilter.toLowerCase() === track.toLowerCase();
          return (
            <Button
              key={track}
              className={`px-8 py-2 border-2 rounded-3xl cursor-pointer w-32 ${
                isActive
                  ? 'bg-[#3F3F3F] text-white border-[#3F3F3F]'
                  : 'border-gray-300 hover:bg-gray-100'
              }`}
              variant="ghost"
              onClick={() => onFilterChange(track)}
            >
              <p className="font-semibold">{track}</p>
            </Button>
          );
        })}
      </div>

      {/* Mobile: dropdown */}
      <MobileFilterDropdown
        currentFilter={currentFilter}
        onFilterChange={onFilterChange}
      />
    </>
  );
}

function MobileFilterDropdown({
  currentFilter,
  onFilterChange,
}: FilterRowProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="md:hidden relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-12 h-12 rounded-xl border-2 border-gray-300 flex items-center justify-center cursor-pointer"
      >
        <FilterIcon />
      </button>

      {open && (
        <div className="absolute top-14 left-0 z-50 bg-white rounded-xl shadow-lg border border-gray-200 py-2 min-w-[180px]">
          {filters.map((track) => {
            const isActive =
              currentFilter.toLowerCase() === track.toLowerCase();
            return (
              <button
                key={track}
                className={`w-full text-left px-4 py-2.5 text-sm font-semibold cursor-pointer ${
                  isActive ? 'bg-[#3F3F3F] text-white' : 'hover:bg-gray-100'
                }`}
                onClick={() => {
                  onFilterChange(track);
                  setOpen(false);
                }}
              >
                {track}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FilterIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 6H20M6 12H18M9 18H15"
        stroke="#3F3F3F"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
