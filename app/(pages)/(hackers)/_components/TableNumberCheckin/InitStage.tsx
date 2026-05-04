'use client';

import Image from 'next/image';
import mascotsCelebrate from '@public/hackers/table-number-checkin/end-of-hackathon.svg';
import rightArrow from '@public/hackers/table-number-checkin/arrow-right.svg';

interface InitStageProps {
  onNext: () => void;
}

export default function InitStage({ onNext }: InitStageProps) {
  return (
    <div className="flex flex-col p-[20px] h-[569px] gap-10 rounded-[20px] bg-[#FAFAFF] md:flex-row md:items-center md:justify-between md:p-[60px]">
      {/* Image - top half on mobile, right side on desktop */}
      <div className="flex flex-1 w-full h-full justify-center md:order-2 md:justify-end md:rounded-[16px]">
        <Image
          src={mascotsCelebrate}
          alt="mascots hanging out"
          className="w-full object-contain"
        />
      </div>

      {/* Content - bottom on mobile, left side on desktop */}
      <div className="flex flex-col flex-1 md:self-stretch justify-between gap-8">
        <div className="flex flex-col gap-1 text-black">
          <h3 className="text-[18px] font-semibold sm:text-[22px] md:text-[26px] lg:text-[32px]">
            The Hackathon has ended!
          </h3>
          <p className="text-[18px] font-semibold text-[#878796] sm:text-[22px] md:text-[26px] lg:text-[32px]">
            Thank you for all your hard work. Next, please follow the directions
            to find your assigned table number.
          </p>
        </div>

        <div className="flex flex-row w-full">
          <button
            className="text-[#1A3819] font-semibold text-[16px] flex justify-center items-center px-8 py-3 rounded-[40px] bg-[#CCFFFE] cursor-pointer shrink-0 md:px-[44px] md:py-5"
            onClick={() => {
              onNext();
            }}
          >
            Ready to find my table
            <div className="relative w-6 aspect-square ml-2">
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
