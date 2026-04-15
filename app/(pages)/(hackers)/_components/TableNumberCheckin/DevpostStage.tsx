'use client';

import Image from 'next/image';
import rightArrow from '@public/hackers/table-number-checkin/arrow-right.svg';
import devpostNumber from '@public/hackers/table-number-checkin/Filler.svg';

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
  const hasTeamNumber = teamNumber.length && Number(teamNumber) > 0;

  return (
    <div
      className="flex flex-col p-[20px] h-[569px] gap-10 rounded-[20px] bg-[#FAFAFF]
                    md:flex-row md:items-center md:justify-between md:p-[60px] overflow-hidden"
    >
      {/* RIGHT column — first in DOM so image appears at top on mobile, right on desktop */}
      <div className="flex flex-col flex-1 w-full h-full justify-between gap-4 md:order-2 min-w-0">
        {/* Screenshot image */}
        <div className="w-full rounded-[16px] overflow-hidden md:flex-1">
          <Image
            src={devpostNumber}
            alt="devpost number screenshot"
            className="w-full h-full object-fill"
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
            value={teamNumber}
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
      <div className="flex flex-col flex-1 md:self-stretch justify-between gap-8 md:order-1">
        <div className="flex flex-col gap-1">
          <h3 className="text-[18px] font-semibold sm:text-[22px] md:text-[26px] lg:text-[32px] md:leading-normal">
            {error
              ? 'Oops! We did not find your Devpost number.'
              : 'Find your Devpost number.'}
          </h3>

          {error ? (
            <p className="text-[18px] font-semibold text-[#878796] sm:text-[22px] md:text-[26px] lg:text-[32px] leading-normal">
              Please double check you have entered the same number listed on
              Devpost.
            </p>
          ) : (
            <p className="text-[18px] font-semibold text-[#878796] sm:text-[22px] md:text-[26px] lg:text-[32px] leading-normal">
              This can be found by going to{' '}
              <a
                href="https://hackdavis-2026.devpost.com/tables"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#5E5E65] underline decoration-[#5E5E65] underline-offset-4 break-all"
              >
                hackdavis-2026.devpost.com/tables
              </a>{' '}
              and finding your project submission name. Enter the number exactly
              as it is presented.
            </p>
          )}
        </div>

        {/* Buttons — bottom of left column on desktop, bottom of card on mobile */}
        <div className="flex justify-between items-center md:justify-normal md:gap-[56px]">
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
