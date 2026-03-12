"use client";

import Image from "next/image";

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
  const hasTeamNumber = teamNumber.length == 5;

  return (
    <div className="flex flex-col p-[20px] mb-[5%] h-[556px] gap-4 rounded-[20px] bg-[#FAFAFF]">
      <div className="flex flex-col gap-1">
        {/* Image - top half */}
        <div className="relative w-full h-[171px]">
          <Image
            src={"./hackers/table-number-checkin/Filler.svg"}
            alt="mascots hanging out"
            fill
            className="object-cover"
          />
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
              placeholder="#####"
              inputMode="numeric"
              maxLength={5}
              pattern="[0-9]*"
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 5);
                onChange(val);
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between w-full h-1/2">
        <div className="">
          <h3 className="text-lg font-semibold">
            {error
              ? "Oops! We did not find your Devpost number."
              : "Find your Devpost number."}
          </h3>

          <p className="text-lg font-semibold text-[#878796]">
            {error
              ? "Please double check you have entered the same number on your devpost account. "
              : "This can be found by going to _____ and selecting____. Enter the number exactly as it is presented."}
          </p>
        </div>
        {/* Buttons */}
        <div className="flex justify-between">
          <button
            onClick={onBack}
            className="text-[#5E5E65] text-base font-semibold border-none"
          >
            Back
          </button>

          <button
            className={`${
              hasTeamNumber
                ? "bg-[#CCFFFE] text-[#1A3819]"
                : "bg-[#F3F3FC] text-[#ACACB9]"
            } font-semibold text-base flex justify-center items-center px-8 py-3 rounded-[40px] cursor-pointer disabled:opacity-30`}
            disabled={!hasTeamNumber}
            onClick={onSubmit}
          >
            {hasTeamNumber ? "Next" : "Got it"}
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
