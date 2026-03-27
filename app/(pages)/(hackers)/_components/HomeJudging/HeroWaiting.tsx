'use client';

import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import { type MouseEvent, useEffect, useRef, useState } from 'react';
import useTableNumberContext from '@pages/_hooks/useTableNumberContext';

import arrowRight from '@public/icons/arrow-right.svg';
import hackersChoiceAsset from '@public/hackers/hero/waiting-hero/hackers-choice-asset.svg';
import judgingAsset from '@public/hackers/hero/waiting-hero/judging-asset.svg';
import pitchAsset from '@public/hackers/hero/waiting-hero/pitch-asset.svg';

type WaitingCardProps = {
  imageSrc: StaticImageData | string;
  imageAlt: string;
  title: string;
  description: string;
  linkLabel?: string;
  href?: string;
};

function WaitingCard({
  imageSrc,
  imageAlt,
  title,
  description,
  linkLabel,
  href,
}: WaitingCardProps) {
  const handleLinkClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!href?.startsWith('#')) {
      return;
    }

    const target = document.getElementById(href.slice(1));
    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', href);
  };

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[16px] bg-white">
      <div className="relative w-full aspect-[16/9]">
        <Image src={imageSrc} alt={imageAlt} fill className="object-cover" />
      </div>
      <div className="flex min-h-[210px] flex-1 flex-col p-5 md:min-h-[190px]">
        <h3 className="font-jakarta text-[1.375rem] font-semibold text-[#3F3F3F] sm:text-[1.3rem] lg:text-[2rem]">
          {title}
        </h3>
        <p className="mt-2 mb-3 font-jakarta text-[1rem] text-[#5E5E65] md:mt-[1vw] md:mb-[2vw]">
          {description}
        </p>
        {linkLabel && href ? (
          <Link
            href={href}
            onClick={handleLinkClick}
            className="mt-auto mb-[1vw] inline-flex items-center gap-2 pt-7 font-dm-mono text-[1rem] text-[#3F3F3F] underline decoration-[1px] underline-offset-4 md:text-[1.125rem]"
          >
            <Image
              src={arrowRight}
              alt=""
              aria-hidden="true"
              className="h-4 w-4"
            />
            {linkLabel}
          </Link>
        ) : null}
      </div>
    </article>
  );
}

const waitingCards: WaitingCardProps[] = [
  {
    imageSrc: pitchAsset,
    imageAlt: 'Practice your pitch',
    title: 'Practice your pitch',
    description:
      'Your pitch is more important than you think! These 5 minutes determine how much your work in the last 24 hours are worth.',
  },
  {
    imageSrc: hackersChoiceAsset,
    imageAlt: 'Submit your vote',
    title: 'Submit your vote',
    description:
      'While you wait, put in your choice for your favorite hack!  You are allowed 1 vote, and you cannot vote for your own team. ',
    linkLabel: 'HACKERS CHOICE AWARD',
    href: '#hackers-choice-awards',
  },
  {
    imageSrc: judgingAsset,
    imageAlt: 'Learn about judging',
    title: 'Learn about Judging',
    description:
      'Ask our AI chatbot any questions regarding the judging rubric, process, and timeline! ',
    linkLabel: 'LEARN OUR JUDGING PROCESS',
    href: '/project-info',
  },
];

export default function HeroWaiting() {
  const { storedValue: tableNumber } = useTableNumberContext();
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const isAutoScrollingRef = useRef(false);
  const autoScrollTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveCardIndex((prevIndex) => (prevIndex + 1) % waitingCards.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    return () => {
      if (autoScrollTimeoutRef.current !== null) {
        window.clearTimeout(autoScrollTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) {
      return;
    }

    const targetCard = carousel.children[activeCardIndex] as
      | HTMLElement
      | undefined;
    if (!targetCard) {
      return;
    }

    isAutoScrollingRef.current = true;
    carousel.scrollTo({
      left: targetCard.offsetLeft,
      behavior: 'smooth',
    });

    if (autoScrollTimeoutRef.current !== null) {
      window.clearTimeout(autoScrollTimeoutRef.current);
    }
    autoScrollTimeoutRef.current = window.setTimeout(() => {
      isAutoScrollingRef.current = false;
    }, 450);
  }, [activeCardIndex]);

  const handleCarouselScroll = () => {
    if (isAutoScrollingRef.current) {
      return;
    }

    const carousel = carouselRef.current;
    if (!carousel) {
      return;
    }

    const cards = Array.from(carousel.children) as HTMLElement[];
    if (!cards.length) {
      return;
    }

    const currentScroll = carousel.scrollLeft;
    let nearestIndex = 0;
    let smallestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, index) => {
      const distance = Math.abs(card.offsetLeft - currentScroll);
      if (distance < smallestDistance) {
        smallestDistance = distance;
        nearestIndex = index;
      }
    });

    setActiveCardIndex((prevIndex) =>
      prevIndex === nearestIndex ? prevIndex : nearestIndex
    );
  };

  return (
    <section className="h-screen w-full box-border p-4 md:p-10">
      <div className="flex flex-col mx-auto h-full w-[90vw] max-w-[1440px] rounded-[32px] bg-[#FAFAFF] justify-center">
        <div className="mx-auto flex w-[92%] max-w-[1120px] flex-col py-8 font-jakarta text-[#3F3F3F] md:py-16">
          <h2 className="text-[1.375rem] md:text-[2.5rem]">
            While you wait at{' '}
            <span className="underline decoration-[1.25px]">
              Table {tableNumber ?? '---'}
            </span>
            ...
          </h2>

          <div
            ref={carouselRef}
            onScroll={handleCarouselScroll}
            className="mt-10 flex items-stretch snap-x snap-mandatory gap-4 overflow-x-auto md:hidden [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
          >
            {waitingCards.map((card) => (
              <div
                key={card.title}
                className="flex w-full shrink-0 snap-center"
              >
                <WaitingCard {...card} />
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-center gap-3 md:hidden">
            {waitingCards.map((card, index) => (
              <button
                key={card.title}
                type="button"
                aria-label={`Go to card ${index + 1}`}
                onClick={() => setActiveCardIndex(index)}
                className={`h-3 w-3 rounded-full transition-colors ${
                  index === activeCardIndex ? 'bg-[#3F3F3F]' : 'bg-[#D9D9DF]'
                }`}
              />
            ))}
          </div>

          <div className="mt-10 hidden gap-4 md:grid md:grid-cols-3">
            {waitingCards.map((card) => (
              <WaitingCard key={card.title} {...card} />
            ))}
          </div>

          <p className="mt-8 font-jakarta text-[0.875rem] font-semibold text-[#5E5E65] md:mt-10 md:text-[1.25rem]">
            Give us a moment while we assign your team judges.
          </p>
        </div>
      </div>
    </section>
  );
}
