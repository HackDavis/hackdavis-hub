'use client';

import Image from 'next/image';
import type { StaticImageData } from 'next/image';
import useIdeateScroll from '@hooks/useIdeateScroll';

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
  const { sectionRef, scrollRef, responsibilityIndex, scrollPos } =
    useIdeateScroll({
      title,
      responsibilities,
    });

  return (
    <div
      ref={sectionRef}
      id="sectionID"
      className="w-full self-stretch px-[16px] min-[1250px]:px-[0px]"
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
              <div
                key={index}
                id={title + `responsibility-` + index}
                className="flex flex-col gap-[4px]"
              >
                <div className="flex flex-row items-center gap-[4px]">
                  <Image
                    src={
                      index == responsibilityIndex
                        ? responsibility.dark_icon
                        : responsibility.light_icon
                    }
                    alt={`${responsibility.title} icon`}
                    className={`transition-all duration-300 ease-out ${
                      index == responsibilityIndex
                        ? 'w-[32px] h-[32px]'
                        : 'w-[24px] h-[24px]'
                    }`}
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
