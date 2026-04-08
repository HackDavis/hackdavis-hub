import Image from 'next/image';
import type { StaticImageData } from 'next/image';
import { useRef, useState } from 'react';

interface Responsibility {
  icon: StaticImageData;
  title: string;
  description: string;
}

// shi figure out that bar!!!!!!
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

  const [responsibilityIndex] = useState(0);
  const [scrollPos] = useState(50);

  /*useEffect(() => {
    const onPageScroll = () => {
      const section = sectionRef.current.scrollTo();
      const scrollContainer = scrollRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const anchorY = window.innerHeight * 0.35;
      const traveled = anchorY - rect.top;
      const rawProgress = traveled / Math.max(rect.height, 1);
      const progress = Math.min(Math.max(rawProgress, 0), 0.999);
      const nextIndex = Math.floor(progress * responsibilities.length);
      const clampedIndex = Math.max(0, Math.min(responsibilities.length - 1, nextIndex));

      setResponsibilityIndex(clampedIndex);

      if (scrollContainer) {
        const maxHeight = scrollContainer.clientHeight;
        const fillProgress = responsibilities.length > 1 ? clampedIndex / (responsibilities.length - 1) : 0;
        setScrollPos(fillProgress * maxHeight);
      }
    };

    onPageScroll();
    window.addEventListener("scroll", onPageScroll, { passive: true });
    //window.addEventListener("resize", onPageScroll);

    return () => {
      window.removeEventListener("scroll", onPageScroll);
      //window.removeEventListener("resize", onPageScroll);
    };
  }, );//[responsibilities.length]);*/

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
                    src={responsibility.icon}
                    alt={`${responsibility.title} icon`}
                    className=""
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
