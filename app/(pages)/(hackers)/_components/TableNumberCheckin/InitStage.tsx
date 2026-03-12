"use client";

import Image from "next/image";

interface InitStageProps {
  onNext: () => void;
}

export default function InitStage({ onNext }: InitStageProps) {
  return (
    <div
      className="flex flex-col mb-[5%] p-[20px] h-[556px] gap-4 rounded-[20px] bg-[#FAFAFF]
                    md:flex-row md:h-[569] md:items-center md:p-[60px]"
    >
      {/* Image - top half on mobile, right side on desktop */}
      <div className="relative w-full h-1/2 md:order-2 md:h-full md:w-1/2 md:rounded-[16px] md:overflow-hidden">
        <Image
          src={"./hackers/table-number-checkin/end-of-hackathon.svg"}
          alt="mascots hanging out"
          fill
          className="object-cover"
        />
      </div>

      {/* Content - bottom on mobile, left side on desktop */}
      <div className="flex flex-col justify-between h-1/2 md:h-full md:w-1/2">
        <div className="flex flex-col gap-1 text-black">
          <h3 className="text-md font-semibold md:text-[32px]">
            The Hackathon has ended!
          </h3>
          <p className="text-md font-semibold text-[#878796] md:text-[32px] leading-normal ">
            Thank you for all your hard work. Next, please follow the directions
            to find your assigned table number.
          </p>
        </div>

        <div className="flex flex-row w-full">
          <button
            className="text-[#1A3819] font-semibold text-base flex justify-center items-center px-8 py-3 rounded-[40px] bg-[#CCFFFE] cursor-pointer shrink-0 md:px-[44px] md:py-5"
            onClick={() => {
              onNext();
            }}
          >
            Ready to find my table
            <div className="relative w-6 h-6 ml-2">
              <Image
                src={"./hackers/table-number-checkin/arrow-right.svg"}
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
