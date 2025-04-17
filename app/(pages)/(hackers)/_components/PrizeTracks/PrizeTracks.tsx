'use client';

import { Button } from '@globals/components/ui/button';
import { allTracks, TrackData } from '@data/tracks';
import PrizeGrid from './PrizeGrid';
import { useState } from 'react';

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
    <div className="flex flex-col">
      <h6>CHECK OUT OUR</h6>
      <h3 className="font-bold text-3xl text-[#9EE7E5] font-metropolis">
        Prize Tracks
      </h3>
    </div>
  );
}

interface FilterItem {
  track: string;
  color: string;
}

interface FilterRowProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
}

function FilterRow({ currentFilter, onFilterChange }: FilterRowProps) {
  const filters: FilterItem[] = [
    { track: 'ALL', color: '#C3F0EF' },
    { track: 'GENERAL', color: '#FFDBCA' },
    { track: 'TECHNICAL', color: '#CDE396' },
    { track: 'DESIGN', color: '#FFDC86' },
    { track: 'BUSINESS', color: '#D5CBE9' },
    { track: 'NONPROFIT', color: '#E7EAEE' },
    { track: 'SPONSOR', color: '#E7EAEE' },
    { track: 'MLH', color: '#E7EAEE' },
  ];

  return (
    <div className="flex gap-4 overflow-x-scroll md:overflow-x-auto">
      {filters.map((filter, index) => {
        const track = filter.track;
        const color = filter.color;
        return (
          <Button
            key={index}
            className="px-8 py-2 border-2 rounded-3xl border-dashed cursor-pointer relative group w-32"
            style={{ borderColor: color }}
            variant="ghost"
            onClick={() => onFilterChange(filter.track)}
          >
            <div
              className={`absolute inset-0 rounded-3xl transition-all duration-300 ease-out cursor-pointer ${
                currentFilter.toLowerCase() === track.toLowerCase()
                  ? 'w-full'
                  : 'w-0 group-hover:w-full'
              } bg-opacity-20`}
              style={{ backgroundColor: color }}
            />
            <p className="font-semibold relative z-10">{track}</p>
          </Button>
        );
      })}
    </div>
  );
}
