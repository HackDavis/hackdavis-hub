'use client';

import Link from 'next/link';
import Image from 'next/image';

interface ConfirmStageProps {
  tableNumber: number | null;
  onConfirm: () => void;
  onReset: () => void;
}

export default function ConfirmStage({
  tableNumber,
  onConfirm,
  onReset,
}: ConfirmStageProps) {
  return (
    <div className="flex flex-col p-[20px] mb-[5%] h-[556px] gap-4 rounded-[20px] bg-[#FAFAFF]">
      {/* Table Number - top half */}
      <div className="flex flex-col justify-center items-center gap-4 rounded-[20px] relative w-full h-1/2 bg-[#0B2638] text-[#FAFAFF] text-center">
        <h1 className="text-6xl text-[#FAFAFF] text-center font-medium tracking-[1.2px]">
          TABLE
        </h1>

        <h1 className="text-6xl text-[#FAFAFF] text-center font-medium tracking-[1.2px]">
          A1
        </h1>
      </div>

      <div>
        {/* Description */}
        <div className="flex flex-col justify-between w-full h-1/2 gap-1">
          <div className="mb-3">
            <h3 className="text-lg font-semibold">Your Table Number</h3>

            <p className="text-lg font-semibold text-[#878796] leading-normal">
              Check that you and your team members received the same table
              number. It is extremely important to be
              <span className="text-[#5E5E65] "> present at your table </span>
              when the judges arrive.
            </p>
          </div>

          <div className="flex gap-2 items-center mb-[10px]">
            <div className="relative w-4 h-4">
              <Image
                src={'./hackers/table-number-checkin/map.svg'}
                alt="Map Icon"
                fill
                className="object-cover"
              />
            </div>

            <Link
              href="#"
              className="text-base font-medium text-[#5E5E65] border-b border-[#5E5E65] leading-none"
            >
              MAP LINK
            </Link>
          </div>

          {/* Buttons */}
          <div className="flex justify-between">
            <button
              onClick={onReset}
              className="text-[#5E5E65] text-base font-semibold border-none"
            >
              Back
            </button>

            <button
              onClick={onConfirm}
              className="bg-[#CCFFFE] text-[#1A3819] font-semibold text-base flex justify-center items-center px-8 py-3 rounded-[40px] cursor-pointer"
            >
              Next
              <div className="relative w-6 h-6 ml-2">
                <Image
                  src={'./hackers/table-number-checkin/arrow-right.svg'}
                  alt="Right Arrow"
                  fill
                  className="object-cover"
                />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
