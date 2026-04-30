'use client';

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
  const touchYRef = useRef<number>(0);
  const enterFromTop = useRef<boolean | null>(true);

  const [responsibilityIndex, setResponsibilityIndex] = useState(0);
  const [scrollPos, setScrollPos] = useState<number | null>(null);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // go to nearest responsibility
    if (!scrollRef.current) return;
  
    const snapToIndex = (index: number) => {
      if (!scrollRef.current) return;
      const maxHeight = scrollRef.current.clientHeight;
      let target = (maxHeight * 1) / 8;
      if (index == 0) {
        target = (maxHeight * 1) / 8;
      } else if (index == 1) {
        target = (maxHeight * 3) / 8;
      } else if (index == 2) {
        target = (maxHeight * 21) / 32;
      } else if (index == 3) {
        target = maxHeight;
      }
      setScrollPos(target);
    }

    const snapToNearest = (pos: number) => {
      if (!scrollRef.current) return;
      const maxHeight = scrollRef.current.clientHeight;
      const positions = [
        (maxHeight * 1) / 8,
        (maxHeight * 3) / 8,
        (maxHeight * 21) / 32,
        maxHeight,
      ];

      let closest = positions[0];

      for (const p of positions) {
        if (Math.abs(pos - p) < Math.abs(pos - closest)) {
          closest = p;
        }
      }

      setScrollPos(closest);
    };

    // scroll for computer
    const onScroll = (e: WheelEvent) => {
      if (!scrollRef.current) return;

      const midpoint =
        (scrollRef.current.getBoundingClientRect().top +
          scrollRef.current.getBoundingClientRect().bottom) /
        2;
      const minScrollHeight = (scrollRef.current.clientHeight * 1) / 8;
      const maxHeight = scrollRef.current
        ? scrollRef.current.clientHeight
        : minScrollHeight;

      // set scroll bar to whatever the user scrolled to
      if (
        midpoint > window.innerHeight / 2 - 50 &&
        midpoint < window.innerHeight / 2 + 50
      ) {
        // if component is within range...

        setScrollPos((prev) => {
          //
          const next = Math.min(
            Math.max(minScrollHeight, prev == null ? 0 : prev + e.deltaY),
            maxHeight
          );

          if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

          // makes it go to nearest responsibility
          scrollTimeout.current = setTimeout(() => {
            snapToNearest(next);
          }, 100);

          return next;
        });

        if (enterFromTop.current == true && scrollPos != maxHeight) {
          if (e.cancelable) {
            e.preventDefault();
          } else {
            const sectionElement = document.getElementById('sectionID');
            if (!sectionElement) return;
            sectionElement.style.touchAction = 'none';
          }
        } else if (
          enterFromTop.current == false &&
          scrollPos != minScrollHeight
        ) {
          if (e.cancelable) {
            e.preventDefault();
          } else {
            const sectionElement = document.getElementById('sectionID');
            if (!sectionElement) return;
            sectionElement.style.touchAction = 'none';
          }
        } else if (enterFromTop.current == true && scrollPos == maxHeight + 5) {
          enterFromTop.current = false;
        } else if (
          enterFromTop.current == false &&
          scrollPos == minScrollHeight - 5
        ) {
          enterFromTop.current = true;
        }
      } else if (scrollPos != maxHeight && scrollPos != minScrollHeight) {
        // if it it somehow not in range but not at where its supposed to be
        if (e.cancelable) {
          e.preventDefault();
        } else {
          const sectionElement = document.getElementById('sectionID');
          if (!sectionElement) return;
          sectionElement.style.touchAction = 'none';
        }
        setScrollPos((prev) => {
          //
          const next = Math.min(
            Math.max(minScrollHeight, prev == null ? 0 : prev + e.deltaY),
            maxHeight
          );

          if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

          // makes it go to nearest responsibility
          scrollTimeout.current = setTimeout(() => {
            snapToNearest(next);
          }, 100);

          return next;
        });
      } else {
        if (midpoint < window.innerHeight / 2 - 50) {
          enterFromTop.current = false;
        } else if (midpoint > window.innerHeight / 2 + 50) {
          enterFromTop.current = true;
        } else {
          enterFromTop.current = null;
        }
      }
    };

    // scroll for mobile
    const onTouchStart = (e: TouchEvent) => {
      touchYRef.current = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!scrollRef.current) return;

      const midpoint =
        (scrollRef.current.getBoundingClientRect().top +
          scrollRef.current.getBoundingClientRect().bottom) /
        2;
      const minScrollHeight = (scrollRef.current.clientHeight * 1) / 8;
      const maxHeight = scrollRef.current
        ? scrollRef.current.clientHeight
        : minScrollHeight;
      const deltaY = touchYRef.current - e.touches[0].clientY;
      touchYRef.current = e.touches[0].clientY;

      // set scroll bar to whatever the user scrolled to
      if (
        midpoint > window.innerHeight / 2 - 50 &&
        midpoint < window.innerHeight / 2 + 50
      ) {
        // if component is within range...

        setScrollPos((prev) => {
          //
          const next = Math.min(
            Math.max(minScrollHeight, prev == null ? 0 : prev + deltaY),
            maxHeight
          );

          if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

          // makes it go to nearest responsibility
          scrollTimeout.current = setTimeout(() => {
            snapToNearest(next);
          }, 100);

          return next;
        });

        if (enterFromTop.current == true && scrollPos != maxHeight) {
          if (e.cancelable) {
            e.preventDefault();
          } else {
            const sectionElement = document.getElementById('sectionID');
            if (!sectionElement) return;
            sectionElement.style.touchAction = 'none';
          }
        } else if (
          enterFromTop.current == false &&
          scrollPos != minScrollHeight
        ) {
          if (e.cancelable) {
            e.preventDefault();
          } else {
            const sectionElement = document.getElementById('sectionID');
            if (!sectionElement) return;
            sectionElement.style.touchAction = 'none';
          }
        } else {
          const sectionElement = document.getElementById('sectionID');
          if (!sectionElement) return;
          sectionElement.style.touchAction = 'auto';
        }
      } else if (scrollPos != maxHeight && scrollPos != minScrollHeight) {
        // if it it somehow not in range but not at where its supposed to be
        if (e.cancelable) {
          e.preventDefault();
        } else {
          const sectionElement = document.getElementById('sectionID');
          if (!sectionElement) return;
          sectionElement.style.touchAction = 'none';
        }
        setScrollPos((prev) => {
          //
          const next = Math.min(
            Math.max(minScrollHeight, prev == null ? 0 : prev + deltaY),
            maxHeight
          );

          if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

          // makes it go to nearest responsibility
          scrollTimeout.current = setTimeout(() => {
            snapToNearest(next);
          }, 100);

          return next;
        });
      } else {
        if (midpoint < window.innerHeight / 2 - 50) {
          enterFromTop.current = false;
        } else if (midpoint > window.innerHeight / 2 + 50) {
          enterFromTop.current = true;
        } else {
          enterFromTop.current = null;
        }
      }
    };

    const onTouchEnd = () => {
      touchYRef.current = 0;
      const sectionElement = document.getElementById('sectionID');
      if (!sectionElement) return;
      sectionElement.style.touchAction = 'auto';
    };

    window.addEventListener('wheel', onScroll, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: false });
    
    const responsibility0 = document.getElementById('responsibility-0');
    const responsibility0_onClick = () => {
        snapToIndex(0);
    };
    if (responsibility0) {
      responsibility0.addEventListener("click", responsibility0_onClick);
    }
    
    const responsibility1 = document.getElementById('responsibility-1');
    const responsibility1_onClick = () => {
        snapToIndex(1);
    };
    if (responsibility1) {
      responsibility1.addEventListener("click", responsibility1_onClick);
    }

    const responsibility2 = document.getElementById('responsibility-2');
    const responsibility2_onClick = () => {
        snapToIndex(2);
    };
    if (responsibility2) {
      responsibility2.addEventListener("click", responsibility2_onClick);
    }

    const responsibility3 = document.getElementById('responsibility-3');
    const responsibility3_onClick = () => {
        snapToIndex(3);
    };
    if (responsibility3) {
      responsibility3.addEventListener("click", responsibility3_onClick);
    }

    return () => {
      window.removeEventListener('wheel', onScroll);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      document.removeEventListener('click', responsibility0_onClick);
      document.removeEventListener('click', responsibility1_onClick);
      document.removeEventListener('click', responsibility2_onClick);
      document.removeEventListener('click', responsibility3_onClick);
    };
  });

  useEffect(() => {
    if (!scrollRef.current) return;
    if (!scrollPos) {
      setScrollPos((scrollRef.current.clientHeight * 1) / 8);
    }

    const maxHeight = scrollRef.current?.clientHeight || 50;
    const positions = [
      (maxHeight * 1) / 8,
      (maxHeight * 3) / 8,
      (maxHeight * 21) / 32,
      maxHeight,
    ];
    const minScrollHeight = (scrollRef.current.clientHeight * 1) / 8;

    let min = 0;
    for (let i = 1; i < positions.length; i++) {
      if (
        Math.abs(
          (scrollPos != null ? scrollPos : minScrollHeight) - positions[i]
        ) <
        Math.abs(
          (scrollPos != null ? scrollPos : minScrollHeight) - positions[min]
        )
      ) {
        min = i;
      }
    }

    setResponsibilityIndex(min);
  }, [scrollPos]);

  return (
    <div
      ref={sectionRef}
      id="sectionID"
      className="w-[700px] px-[16px] min-[1250px]:px-[0px] min-[1250px]:w-full"
    >
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
          className="w-full min-[1250px]:w-[500px]"
        />

        <div className=" flex flex-row align-middle items-stretch min-[1250px]:w-[700px]">
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
              <div key={index} id={`responsibility-` + index} className="flex flex-col gap-[4px]">
                <div className="flex flex-row items-center gap-[4px]">
                  <Image
                    src={
                      index == responsibilityIndex
                        ? responsibility.dark_icon
                        : responsibility.light_icon
                    }
                    alt={`${responsibility.title} icon`}
                    className={`transition-all duration-300 ease-out ${index == responsibilityIndex ? 'w-[32px] h-[32px]' : 'w-[24px] h-[24px]'}`}
                  />
                  {index == responsibilityIndex ? (
                    <p className="text-[20px] text-[#1F1F1F] font-semibold transition-all">
                      {responsibility.title}
                    </p>
                  ) : (
                    <p className="text-[16px] text-[#ACACB9] font-semibold transition-all">
                      {responsibility.title}
                    </p>
                  )}
                </div>
                {index == responsibilityIndex ? (
                  <p className="opacity-[0.65] text-[16px] transition-all">
                    {responsibility.description}
                  </p>
                ) : (
                  <p className="text-[16px] transition-all"></p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
