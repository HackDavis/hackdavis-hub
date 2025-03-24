import type { Prize } from '@datalib/prizes/getPrizes';
import Image from 'next/image';
import { FaChevronRight } from 'react-icons/fa6';

export default function PrizeGrid({ items }: { items: Prize[] }) {
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
    <main className="flex bg-white p-4 border shadow-md w-[400px] max-w-[500px]">
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
