import next from 'next';
import Image from 'next/image';
import type { StaticImageData } from 'next/image';
import { useRef, useState, useEffect } from 'react';

interface Responsibility {
  dark_icon: StaticImageData;
  light_icon: StaticImageData;
  title: string;
  description: string;
}

export function Responsibilities({
  image,
  title,
  responsibilities,
  reverse,
}: {
  image: StaticImageData;
  title: string;
  responsibilities: Responsibility[];
  reverse: boolean;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [responsibilityIndex, setResponsibilityIndex] = useState(0);
  const [scrollPos, setScrollPos] = useState(50);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const snapToNearest = (pos: number) => {
      const maxHeight = scrollRef.current?.clientHeight || 50;
      const positions = [
        maxHeight * 1 / 8,
        maxHeight * 3 / 8,
        maxHeight * 21 / 32,
        maxHeight,
      ];

      let closest = positions[0];

      for (let p of positions) {
        if (Math.abs(pos - p) < Math.abs(pos - closest)) {
          closest = p;
        }
      }

      setScrollPos(closest);
    };

    const onScroll = (e: WheelEvent) => {
      if (!scrollRef.current) return;

      const midpoint = (scrollRef.current.getBoundingClientRect().top + scrollRef.current.getBoundingClientRect().bottom) / 2;
      const minHeight = scrollRef.current?.clientHeight * 1 / 8 || 50;

      // Set scroll bar to whatever the user scrolled to
      if (midpoint > window.innerHeight / 2 - 100 && midpoint < window.innerHeight / 2 + 100) {
        const maxHeight = scrollRef.current ? scrollRef.current.clientHeight : minHeight;

        setScrollPos((prev) => {
          const next = Math.min(Math.max(minHeight, prev + e.deltaY), maxHeight);

          if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

          scrollTimeout.current = setTimeout(() => {
            snapToNearest(next);
          }, 10);

          if (next !== maxHeight && next !== minHeight) {
            e.preventDefault();
          } 

          return next;
        });

      }
    };

    window.addEventListener("wheel", onScroll, { passive: false });

    return () => {
      window.removeEventListener("wheel", onScroll);
    }
  });

  useEffect(() => {
    const maxHeight = scrollRef.current?.clientHeight || 50;
    const positions = [maxHeight * 1 / 8, maxHeight * 3 / 8, maxHeight * 21 / 32, maxHeight];

    let min = 0;
    for (let i = 1; i < positions.length; i++) {
      if (Math.abs(scrollPos - positions[i]) < Math.abs(scrollPos - positions[min])) {
        min = i;
      }
    }

    setResponsibilityIndex(min);
  }, [scrollPos]);

  return (
    <div ref={sectionRef}>
      <p className="opacity-[0.40] text-[16px] font-mono pb-[12px]">IDEATE</p>
      <p className="text-[32px] text-[#1F1F1F] font-semibold">{title}</p>
      <div
        className={
          'flex flex-col py-[40px] lg:pr-[70px] gap-[60px] align-middle items-start' +
          (reverse
            ? ' min-[1250px]:flex-row-reverse'
            : ' min-[1250px]:flex-row')
        }
      >
        <Image
          src={image}
          alt={`${title} image`}
          className="w-full min-[1250px]:w-[300px] min-[1400px]:w-[440px]"
        />

        <div className=" flex flex-row align-middle items-stretch">
          <div
            ref={scrollRef}
            className="bg-[#E2E2E2] h-auto outline-[2px] outline-[#E2E2E2] rounded-full overflow-visible relative w-[8px]"
          >
            <div
              className="absolute left-0 top-0 w-full border-[2px] border-[#1F1F1F] bg-[#1F1F1F] rounded-full transition-[height] duration-200 ease-out"
              style={{ height: `${scrollPos}px` }}
            ></div>
          </div>
          <div className="flex gap-[57px] flex-col h-min px-[12px]">
            {responsibilities.map((responsibility, index) => (
              <div key={index} className="flex flex-col gap-[4px]">
                <div className="flex flex-row items-center gap-[4px]">
                  <Image
                    src={index == responsibilityIndex ? responsibility.dark_icon : responsibility.light_icon}
                    alt={`${responsibility.title} icon`}
                    className={index == responsibilityIndex ? `w-[32px] h-[32px]` : `w-[24px] h-[24px]`}
                  />
                  {index == responsibilityIndex ? (
                    <p className="text-[20px] text-[#1F1F1F] font-semibold">
                      {responsibility.title}
                    </p>
                  ) : (
                    <p className="text-[16px] text-[#ACACB9] font-semibold">
                      {responsibility.title}
                    </p>
                  )}
                </div>
                {index == responsibilityIndex && (
                  <p className="opacity-[0.65] text-[16px]">
                    {responsibility.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
