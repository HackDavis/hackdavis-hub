import charge_phone from '@public/judges/landing/charge_phone.svg';
import say_hi from '@public/judges/landing/say_hi.svg';
import snack from '@public/judges/landing/snack.svg';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
//import { Button } from '@pages/_globals/components/ui/button';
import arrow from '@public/judges/landing/arrow.svg';
import type { StaticImageData } from 'next/image';

import dark_circle from '@public/judges/landing/dark_circle.svg';
import light_circle from '@public/judges/landing/light_circle.svg';

interface Card {
  src: StaticImageData;
  title: string;
  desc: string;
  linkMap: boolean;
}

function Card({ card }: { card: Card }) {
  return (
    <div className="relative min-w-full h-[420px] bg-white rounded-[20px] overflow-hidden snap-start">
      <Image src={card.src} alt={card.title} className="w-full" />
      <div className="w-full py-[16px] px-[24px]">
        <p className="text-[#3F3F3F] text-[22px] font-semibold">{card.title}</p>
        <p className="text-[#5E5E65] text-wrap text-[16px]">{card.desc}</p>

        {card.linkMap ? (
          <div className="absolute bottom-[12px] left-[24px] z-10 flex flex-row items-center gap-[4px] pt-[60px]">
            <Image src={arrow} alt="arrow" className="" />
            <button className="text-[#3F3F3F] text-[16px] bg-transparent shadow-none underline">
              MAP
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/*const tips = [
  '🔋 Charge your phone!',
  '👋 Say hi to other judges!',
  '🍿 Grab a snack and water!',
];*/

/*const TipCard = (tip: string) => {
  return (
    <div className="flex text-xl items-center justify-center bg-white rounded-[16px] py-[20px]">
      {tip}
    </div>
  );
};*/

export default function Waiting() {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  const cards = [
    {
      src: charge_phone,
      title: 'Charge your phone',
      desc: 'Feel free to charge your phone.',
      linkMap: false,
    },
    {
      src: snack,
      title: 'Grab a snack and water',
      desc: 'Feel free to re-energize as you wait for our hackers',
      linkMap: true,
    },
    {
      src: say_hi,
      title: 'Say hi to other judges',
      desc: 'Get comfy and meet other Judges.',
      linkMap: false,
    },
  ];

  const handleCardsScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const container = event.currentTarget;
    const cardWidth = container.clientWidth + 10;
    const nextIndex = Math.round(container.scrollLeft / cardWidth);

    setActiveCardIndex(Math.max(0, Math.min(cards.length - 1, nextIndex)));
  };

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      const container = cardsContainerRef.current;
      if (!container || cards.length === 0) return;

      const firstCard = container.firstElementChild as HTMLElement | null;
      if (!firstCard) return;

      const styles = window.getComputedStyle(container);
      const gap = parseFloat(styles.gap || '0');
      const cardWidth = firstCard.offsetWidth + gap;

      setActiveCardIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % cards.length;
        container.scrollTo({
          left: cardWidth * nextIndex,
          behavior: 'smooth',
        });
        return nextIndex;
      });
    }, 10000);

    return () => window.clearInterval(intervalId);
  }, [cards.length]);

  return (
    <div id="cards" className="display flex flex-col gap-[20px]">
      <p className="text-[22px] text-[#3F3F3F] font-semibold">
        While you are waiting...
      </p>
      <div
        className="flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] gap-[10px]"
        ref={cardsContainerRef}
        onScroll={handleCardsScroll}
      >
        {cards.map((card, index) => (
          <Card key={index} card={card} />
        ))}
      </div>
      <div className="w-full justify-center flex gap-[12px]">
        {cards.map((_, index) => (
          <Image
            key={index}
            src={activeCardIndex === index ? dark_circle : light_circle}
            alt="carousel indicator"
            className="w-[12px]"
          />
        ))}
      </div>
    </div>
  );
}
