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

function FilterRow({ currentFilter, onFilterChange }: FilterRowProps) {
  const filters = [
    'ALL',
    'GENERAL',
    'TECHNICAL',
    'DESIGN',
    'BUSINESS',
    'SPONSOR',
    'NON-PROFIT',
  ];

  return (
    <div className="flex gap-4 overflow-x-scroll md:overflow-x-auto">
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
  );
}
