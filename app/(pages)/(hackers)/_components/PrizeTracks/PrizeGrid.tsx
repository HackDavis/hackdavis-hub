import type { Prize } from '@apidata/getPrizes';
import Image from 'next/image';

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@globals/components/ui/accordion';

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
    <main className="flex flex-col bg-white p-8 shadow-[0px_8px_24px_rgba(149,157,165,0.2)] w-[528px] h-fit">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <div className="flex gap-4">
            <div className="flex flex-col w-1/2 justify-between">
              <div className="flex flex-col">
                <h6 className="font-bold">{item.tracks}</h6>
                <p className="text-xs">{item.prize}</p>
                <p className="text-xss">{item.additionalPrize}</p>
              </div>
              <AccordionTrigger>
                <p className="text-sm">ELIGIBILITY CRITERIA</p>
              </AccordionTrigger>
            </div>
            <div className="w-1/2 aspect-square p-4 bg-[linear-gradient(284.39deg,rgba(213,252,209,0.4)_9.72%,rgba(178,231,221,0.4)_44.61%,rgba(118,214,230,0.4)_79.5%)]">
              <div className="relative w-full h-full">
                <Image src={item.image} alt="prize image" fill></Image>
              </div>
            </div>
          </div>
          <AccordionContent>{item.eligability_criteria}</AccordionContent>
        </AccordionItem>
      </Accordion>
    </main>
  );
}
