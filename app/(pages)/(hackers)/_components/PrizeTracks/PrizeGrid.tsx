import type { Prize } from '@data/prizes';
import PrizeCard from './PrizeCard';

export default function PrizeGrid({ items }: { items: Prize[] }) {
  return (
    <main className="grid md:grid-cols-2 gap-8 lg:gap-12 w-full mx-[16px] xl:mx-[48px]">
      {items.map((item) => {
        return (
          <PrizeCard
            key={item.track}
            name={item.track}
            prizeNames={item.prizes}
            prizeImages={item.images}
            criteria={item.eligability_criteria}
          />
        );
      })}
    </main>
  );
}
