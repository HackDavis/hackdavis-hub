'use client';

import Image from 'next/image';
import loadingBus from '@public/hackers/table-number-checkin/bus_loading.gif';
import rightArrow from '@public/hackers/table-number-checkin/arrow-right.svg';

interface LoadingStageProps {
  teamNumber: string;
}

export default function LoadingStage({ teamNumber }: LoadingStageProps) {
  return (
    <div
      className="flex flex-col p-[20px] h-[569px] gap-10 rounded-[20px] bg-[#FAFAFF]
                    md:flex-row md:items-center md:justify-between md:p-[60px]"
    >
      {/* RIGHT column — first in DOM so image appears at top on mobile, right on desktop */}
      <div className="flex flex-col flex-1 w-full gap-3 md:order-2 md:self-stretch">
        {/* Image */}
        <div className="relative w-full h-[349px] bg-[#F3F3FC] rounded-[20px] flex items-center justify-center md:rounded-[16px] md:overflow-hidden">
          <Image
            src={loadingBus}
            alt="animated bus loading"
            fill
            unoptimized
            className="object-contain object-center rounded-[20px]"
          />
        </div>

        {/* Devpost Number — below image */}
        <div className="flex flex-col gap-1">
          <p className="text-[12px] font-normal text-[#878796] tracking-wide md:text-[14px]">
            DEVPOST NUMBER
          </p>

          <input
            type="text"
            value={teamNumber}
            readOnly
            placeholder="#####"
            inputMode="numeric"
            maxLength={5}
            pattern="[0-9]*"
            className="w-full border border-[#E0E0F0] rounded-[12px] px-4 py-5 text-base bg-white placeholder:text-[#ACACB9] focus:outline-none cursor-default"
          />
        </div>
      </div>

      {/* LEFT column — second in DOM, reordered to first on desktop */}
      <div className="flex flex-col flex-1 md:self-stretch justify-between gap-8 md:order-1">
        <div className="flex flex-col gap-1">
          <h3 className="text-[18px] font-semibold sm:text-[22px] md:text-[26px] lg:text-[32px]">
            Searching high and low...
          </h3>

          <p className="text-[18px] font-semibold text-[#878796] sm:text-[22px] md:text-[26px] lg:text-[32px] leading-normal">
            Did you know that this year is HackDavis's 10 year anniversary?
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center md:justify-normal md:gap-[56px]">
          <button
            disabled
            className="text-[#5E5E65] text-base font-semibold border-none bg-transparent opacity-30"
          >
            Back
          </button>

          <button
            disabled
            className="bg-[#F3F3FC] text-[#ACACB9] font-semibold text-base flex justify-center items-center px-8 py-3 rounded-[40px] opacity-30 md:px-[44px] md:py-5"
          >
            Next
            <div className="relative w-6 h-6 ml-2">
              <Image
                src={rightArrow}
                alt="Right Arrow"
                fill
                className="object-cover"
              />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
