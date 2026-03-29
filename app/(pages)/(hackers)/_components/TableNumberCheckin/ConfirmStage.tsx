'use client';

import Link from 'next/link';
import Image from 'next/image';

interface ConfirmStageProps {
  tableNumber: string | null;
  onConfirm: () => void;
  onReset: () => void;
}

export default function ConfirmStage({
  tableNumber,
  onConfirm,
  onReset,
}: ConfirmStageProps) {
  return (
    <div
      className="flex flex-col p-[20px] h-[556px] mb-[5%] gap-4 rounded-[20px] bg-[#FAFAFF]
                    md:flex-row md:h-[569px] md:items-stretch md:p-[60px] md:gap-8"
    >
      {/* RIGHT column — first in DOM so it appears at top on mobile, right on desktop */}
      <div className="flex flex-col gap-3 md:order-2 md:w-1/2">
        {/* Table Number Card */}
        <div className="flex flex-col justify-center items-center gap-4 rounded-[16px] w-full h-[171px] bg-[#0B2638] md:flex-1 md:h-auto">
          <h1 className="text-6xl text-[#FAFAFF] text-center font-medium tracking-[1.2px] md:text-[120px]">
            TABLE
          </h1>
          <h1 className="text-6xl text-[#FAFAFF] text-center font-medium tracking-[1.2px] md:text-[120px]">
            {tableNumber ?? 'A1'}
          </h1>
        </div>
      </div>

      {/* LEFT column — second in DOM, reordered to first on desktop */}
      <div className="flex flex-col justify-between flex-1 md:order-1 md:w-1/2 md:flex-none">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold md:text-[32px] leading-normal">
            Your Table Number
          </h3>

          <p className="text-lg font-semibold text-[#878796] md:text-[32px] leading-normal">
            Check that you and your team members received the same table number.
            It is extremely important to be
            <span className="text-[#5E5E65]"> present at your table </span> when
            the judges arrive.
          </p>

          <div className="flex gap-2 items-center mt-2">
            <div className="relative w-4 h-4 md:w-6 md:h-6">
              <Image
                src={'./hackers/table-number-checkin/map.svg'}
                alt="Map Icon"
                fill
                className="object-cover"
              />
            </div>

            <Link
              href="#"
              className="text-[14px] font-normal text-[#5E5E65] border-b border-[#5E5E65] leading-none tracking-wide md:text-[18px]"
            >
              MAP LINK
            </Link>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center mt-4 md:justify-normal md:gap-[56px] md:mt-auto">
          <button
            onClick={onReset}
            className="text-[#5E5E65] text-base font-semibold border-none bg-transparent"
          >
            Wait, this is not my team
          </button>

          <button
            onClick={onConfirm}
            className="bg-[#CCFFFE] text-[#1A3819] font-semibold text-base flex gap-2 justify-center items-center px-8 py-3 rounded-[40px] cursor-pointer md:px-[44px] md:py-5 whitespace-nowrap"
          >
            Got it
            <div className="relative hidden md:block w-4 h-4">
              <Image
                src={'./hackers/table-number-checkin/check.svg'}
                alt="Checkmark"
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
