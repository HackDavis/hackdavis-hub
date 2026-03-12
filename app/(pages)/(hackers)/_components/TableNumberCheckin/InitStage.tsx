"use client";

import Image from "next/image";

interface InitStageProps {
  onNext: () => void;
}

export default function InitStage({ onNext }: InitStageProps) {
  return (
    <div className="flex flex-col p-[20px] mb-[5%] h-[556px] gap-4 rounded-[20px] bg-[#FAFAFF]">
      {/* Image - top half */}
      <div className="relative w-full h-1/2">
        <Image
          src={"./hackers/end_of_hackathon.svg"}
          alt="mascots hanging out"
          fill
          className="object-cover"
        />
      </div>

      {/* Content - bottom */}
      <div className="flex flex-col justify-between h-1/2">
        <div className="flex flex-col gap-1 text-black">
          <h3 className="text-lg font-semibold">The Hackathon has ended!</h3>
          <p className="text-lg font-semibold text-[#878796]">
            Thank you for all your hard work. Next, please follow the directions
            to find your assigned table number.
          </p>
        </div>
        <div className="flex flex-row gap-11 w-full">
          <button
            className="text-[#1A3819] font-semibold text-base flex justify-center items-center px-8 py-3 rounded-[40px] bg-[#CCFFFE] cursor-pointer shrink-0"
            onClick={onNext}
          >
            Ready to find my table
            <div className="relative w-6 h-6 ml-2">
              <Image
                src={"./hackers/arrow-right.svg"}
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
