import { prizes } from '@datalib/prizes/getPrizes';
import type { Prize } from '@datalib/prizes/getPrizes';
import Image from 'next/image';
import { FaChevronRight } from 'react-icons/fa6';

export default function PrizeTracks() {
  return (
    <main className="flex flex-col gap-4 p-10">
      <Header />
      <FilterRow />
      <div className="flex items-center justify-center w-full ">
        <PrizeGrid items={prizes} />
      </div>
    </main>
  );
}

function PrizeGrid({ items }: { items: Prize[] }) {
  return (
    <main className="grid sm:grid-cols-2 gap-12">
      {items.map((item) => {
        return <PrizeCard item={item} key={item.tracks} />;
      })}
    </main>
  );
}

function PrizeCard({ item }: { item: Prize }) {
  return (
    <main className="flex bg-white p-4 border shadow-md max-w-[500px]">
      <div className="flex flex-col w-1/2 justify-between">
        <div className="flex flex-col">
          <h6 className="font-bold">{item.tracks}</h6>
          <p>{item.prize}</p>
        </div>
        <div className="flex gap-4 items-center">
          <FaChevronRight />
          <p>ELIGIBILITY CRITERIA</p>
        </div>
      </div>
      <div className="relative w-1/2 border aspect-square">
        <Image src={item.image} alt="prize image" fill></Image>
      </div>
    </main>
  );
}

function Header() {
  return (
    <div className="flex flex-col">
      <h6>CHECK OUT OUR</h6>
      <h3 className="font-bold text-[#9EE7E5]">Prize Tracks</h3>
    </div>
  );
}

interface FilterItem {
  track: string;
  color: string;
}

function FilterRow() {
  const filters: FilterItem[] = [
    { track: 'ALL', color: '#C3F0EF' },
    { track: 'GENERAL', color: '#FFDBCA' },
    { track: 'TECHNICAL', color: '#CDE396' },
    { track: 'DESIGN', color: '#FFDC86' },
    { track: 'BUSINESS', color: '#D5CBE9' },
    { track: 'NONPROFIT', color: '#D5CBE9' },
  ];

  return (
    <div className="flex flex-wrap gap-4">
      {filters.map((filter, index) => {
        const track = filter.track;
        const color = filter.color;
        return (
          <div
            key={index}
            className="px-8 py-2 border-2 rounded-3xl border-dashed cursor-pointer relative overflow-hidden group"
            style={{ borderColor: color }}
          >
            <div
              className="absolute inset-0 w-0 bg-opacity-20 transition-all duration-300 ease-out group-hover:w-full"
              style={{ backgroundColor: color }}
            />
            <p className="font-semibold relative z-10">{track}</p>
          </div>
        );
      })}
    </div>
  );
}
