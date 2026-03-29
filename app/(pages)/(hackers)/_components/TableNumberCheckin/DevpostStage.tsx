'use client';

import Image from 'next/image';
import rightArrow from '@public/hackers/table-number-checkin/arrow-right.svg';
import devpostNumber from './hackers/table-number-checkin/Filler.svg'

interface DevpostStageProps {
  teamNumber: string;
  error: string | null;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export default function DevpostStage({
  teamNumber,
  error,
  onChange,
  onSubmit,
  onBack,
}: DevpostStageProps) {
  const hasTeamNumber = teamNumber.length;

  return (
    <div
      className="flex flex-col p-[20px] h-[556px] mb-[5%] rounded-[20px] bg-[#FAFAFF]
                    md:flex-row md:h-[569px] md:items-stretch md:p-[60px] md:gap-8"
    >
      {/* RIGHT column — first in DOM so image appears at top on mobile, right on desktop */}
      <div className="flex flex-col gap-3 md:order-2 md:w-1/2">
        {/* Screenshot image */}
        <div className="relative w-full h-[171px] md:flex-1 md:rounded-[16px] md:overflow-hidden">
          <Image
            src={devpostNumber}
            alt="devpost number screenshot"
            fill
            className="object-cover"
          />
        </div>

        {/* Devpost Number Input — below image */}
        <div className="flex flex-col gap-1">
          <p className="text-[14px] font-normal text-[#878796] tracking-wide">
            DEVPOST NUMBER
          </p>
          <input
            type="text"
            placeholder="#####"
            inputMode="numeric"
            maxLength={5}
            pattern="[0-9]*"
            className="w-full border border-[#E0E0F0] rounded-[12px] px-4 py-3 text-base bg-white placeholder:text-[#ACACB9] focus:outline-none focus:ring-2 focus:ring-[#CCFFFE]"
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 5);
              onChange(val);
            }}
          />
        </div>
      </div>

      {/* LEFT column — second in DOM, reordered to first on desktop */}
      <div className="flex flex-col justify-between md:order-1 md:w-1/2">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold md:text-[32px] md:leading-normal">
            {error
              ? 'Oops! We did not find your Devpost number.'
              : 'Find your Devpost number.'}
          </h3>

          <p className="text-lg font-semibold text-[#878796] md:text-[32px] leading-normal">
            {error
              ? 'Please double check you have entered the same number listed on Devpost.'
              : 'This can be found by going to https://hackdavis-2025.devpost.com/tables and finding your project submission name. Enter the number exactly as it is presented.'}
          </p>
        </div>

        {/* Buttons — bottom of left column on desktop, bottom of card on mobile */}
        <div className="flex justify-between items-center mt-4 md:justify-normal md:gap-[56px] md:mt-auto">
          <button
            onClick={onBack}
            className="text-[#5E5E65] text-base font-semibold border-none bg-transparent"
          >
            Back
          </button>

          <button
            className={`${
              hasTeamNumber
                ? 'bg-[#CCFFFE] text-[#1A3819]'
                : 'bg-[#F3F3FC] text-[#ACACB9]'
            } font-semibold text-base flex justify-center items-center px-8 py-3 rounded-[40px] cursor-pointer disabled:opacity-30 md:px-[44px] md:py-5`}
            disabled={!hasTeamNumber}
            onClick={onSubmit}
          >
            {hasTeamNumber ? 'Next' : 'Got it'}
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
