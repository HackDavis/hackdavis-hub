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
    <main className="flex flex-col bg-white p-4 border shadow-md w-[400px] max-w-[500px] h-fit">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <div className="flex gap-4">
            <div className="flex flex-col w-1/2 justify-between">
              <div className="flex flex-col">
                <h6 className="font-bold">{item.tracks}</h6>
                <p>{item.prize}</p>
              </div>
              <AccordionTrigger>
                <p className="text-sm">ELIGIBILITY CRITERIA</p>
              </AccordionTrigger>
            </div>
            <div className="relative w-1/2 aspect-square">
              <Image src={item.image} alt="prize image" fill></Image>
            </div>
          </div>
          <AccordionContent>{item.eligability_criteria}</AccordionContent>
        </AccordionItem>
      </Accordion>
    </main>
  );
}
