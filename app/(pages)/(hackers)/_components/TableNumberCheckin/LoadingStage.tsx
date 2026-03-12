"use client";

import Image from "next/image";
interface LoadingStageProps {
  teamNumber: string;
}

export default function LoadingStage({ teamNumber }: LoadingStageProps) {
  return (
    <div className="flex flex-col p-[20px] mb-[5%] h-[556px] gap-4 rounded-[20px] bg-[#FAFAFF]">
      <div className="flex flex-col gap-1">
        {/* Image - top half */}
        <div className="relative w-full h-[171px]">
          <Image
            src={"./hackers/table-number-checkin/loading.svg"}
            alt="mascots hanging out"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Devpost Number */}
      <div className="flex flex-col gap-1">
        <p className="mt-1 text-xs font-semibold text-[#878796]">
          DEVPOST NUMBER
        </p>

        {/* Input */}
        <div className="flex flex-col">
          <input
            type="text"
            value={teamNumber}
            readOnly
            placeholder="#####"
            inputMode="numeric"
            maxLength={5}
            pattern="[0-9]*"
          />
        </div>
      </div>

      <div className="flex flex-col justify-between w-full h-1/2">
        <div>
          <h3 className="text-lg font-semibold">Searching high and low...</h3>
          <p className="text-lg font-semibold text-[#878796]">
            Did you know that this year is HackDavis’s 10 year anniversary?
          </p>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          disabled
          className="text-[#5E5E65] text-base font-semibold border-none opacity-30"
        >
          Back
        </button>

        <button
          disabled
          className="bg-[#F3F3FC] text-[#ACACB9] font-semibold text-base flex justify-center items-center px-8 py-3 rounded-[40px] opacity-30"
        >
          Next
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
  );
}
