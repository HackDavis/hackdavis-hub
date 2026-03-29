'use client';

import Image from 'next/image';
import loadingBus from '@public/hackers/table-number-checkin/loading.svg'
import rightArrow from '@public/hackers/table-number-checkin/arrow-right.svg'

interface LoadingStageProps {
  teamNumber: string;
}

export default function LoadingStage({ teamNumber }: LoadingStageProps) {
  return (
    <div
      className="flex flex-col p-[20px] h-[556px] mb-[5%] rounded-[20px] bg-[#FAFAFF]
                    md:flex-row md:h-[569px] md:items-stretch md:p-[60px] md:gap-8"
    >
      {/* RIGHT column — first in DOM so image appears at top on mobile, right on desktop */}
      <div className="flex flex-col gap-3 md:order-2 md:w-1/2">
        {/* Image */}
        <div className="relative w-full h-[171px] rounded-[20px] md:flex-1 md:rounded-[16px] md:overflow-hidden">
          <Image
            src={loadingBus}
            alt="mascots hanging out"
            fill
            className="object-cover rounded-[20px]"
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
      <div className="flex flex-1 flex-col justify-between md:order-1 md:w-1/2 mt-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold md:text-[32px]">
            Searching high and low...
          </h3>

          <p className="text-lg font-semibold text-[#878796] md:text-[32px] leading-normal">
            Did you know that this year is HackDavis's 10 year anniversary?
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center mt-4 md:justify-normal md:gap-[56px] md:mt-auto">
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
