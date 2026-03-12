'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useTableNumber } from '@pages/_hooks/useTableNumber';

import sleepyFrog from '@public/hackers/table-number-checkin/sleeping-frog.svg';
import modalArrow from '@public/hackers/table-number-checkin/modal-arrow.svg';
import diagArrow from '@public/hackers/table-number-checkin/diag-arrow.svg';

import useTableNumberContext from '@pages/_hooks/useTableNumberContext';

export default function TableNumberCheckin() {
  const {
    loading: localStorageLoading,
    storedValue,
    setValue,
  } = useTableNumberContext();

  const [teamNumber, setTeamNumber] = useState('');
  const { loading, tableNumber, fetchTableNumber, setTableNumber, error } =
    useTableNumber();

  if (localStorageLoading || storedValue) {
    return null;
  }

  let stage = 'init';
  if (loading) {
    stage = 'loading';
  } else {
    stage = tableNumber ? 'confirm' : 'init';
  }

  const handleTeamNumberSubmit = () => {
    fetchTableNumber(Number(teamNumber));
  };

  const hasTeamNumber = Boolean(teamNumber);

  const inputStage = (
    <div className="flex flex-col p-[20px] mb-[5%] h-[556px] gap-4 rounded-[20px] bg-[#FAFAFF]">
      {/* Image - top half */}
      <div className="relative w-full h-1/2">
        <Image
          src={'./hackers/end_of_hackathon.svg'}
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
            for find your assigned table number.
          </p>
        </div>
        <div className="flex flex-row gap-11 w-full">
          {/* <input
          type="text"
          className={`rounded-2xl bg-white/70 border-transparent px-4 py-4 grow min-w-0 text-[#005271] text-lg border-none focus:outline-none focus:ring-0 placeholder:text-[#005271] tablet-s:text-sm tablet-s:py-2 desktop-s:text-base ${
            error ? "border border-red-500" : ""
          }`}
          placeholder="#####"
          value={teamNumber}
          onChange={(e) => setTeamNumber(e.target.value)}
        /> */}
          <button
            className="text-[#1A3819] font-semibold text-base flex justify-center items-center px-8 py-3 rounded-[40px] bg-[#CCFFFE] cursor-pointer shrink-0 "
            disabled={!hasTeamNumber}
            onClick={handleTeamNumberSubmit}
          >
            Ready to find my table
            <div className="relative w-6 h-6">
              <Image
                src={'./hackers/arrow-right.svg'}
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

  const loadingStage = (
    <div className="h-full flex flex-col items-center justify-end px-[120px] pt-[250px] pb-20 gap-[150px] tablet-xl:px-[60px] tablet-xl:pt-[120px] tablet-xl:pb-[60px]0 tablet-s:px-10 tablet-s:pt-20 tablet-s:pb-10 tablet-s:gap-[60px]">
      <Image
        src={sleepyFrog}
        alt="sleepy frog"
        className="w-1/2 h-auto -translate-x-[5%]"
      />
      <div className="flex flex-col gap-3 text-black text-center font-jakarta px-6 tablet-s:px-2">
        <h3 className="text-lg font-semibold tablet-s:text-sm">
          SEARCHING HIGH AND LOW...
        </h3>
        <p className="text-lg font-normal tablet-s:text-sm">
          Please wait patiently while we match you to a judging table. Btw did
          you know next year will be HackDavis's 10 year anniversary?
        </p>
      </div>
    </div>
  );

  const confirmStage = (
    <div className="relative h-full flex flex-col items-center px-[120px] py-20 gap-10 tablet-xl:px-[90px] tablet-xl:py-[60px] tablet-xl:gap-8 tablet-l:px-10 tablet-l:py-10 tablet-l:gap-6 tablet-s:px-6 tablet-s:py-6">
      {/* Header */}
      <div className="flex flex-row-reverse h-min gap-20 tablet-xl:flex-col tablet-xl:gap-4">
        <h1 className="text-[250px] font-light tablet-xl:text-center tablet-xl:text-[64px] tablet-xl:w-full">
          {tableNumber}
        </h1>
        <div className="flex flex-col items-start text-left justify-between py-[60px] tablet-xl:py-0 tablet-xl:items-center">
          <div className="flex flex-col gap-3 text-black font-jakarta tablet-xl:text-center">
            <h3 className="text-lg font-semibold tablet-s:text-sm">
              YOUR TABLE NUMBER
            </h3>
            <div className="flex flex-col gap-3 text-lg font-normal tablet-s:text-sm">
              <Link
                href="https://drive.google.com/file/d/1l6fxi9jDKlleaStt4xXSgCjVg4dfQkjz/view"
                target="_blank"
                className="underline underline-offset-4 flex flex-row mb-4"
              >
                Map Link <Image src={diagArrow} alt="arrow" className="ml-1" />
              </Link>
              <p>
                Check that you and your team members received the same table
                number. It is extremely important to be{' '}
                <strong>present at your table</strong> when the judges arrive.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Input Row */}
      <div className="flex flex-row gap-11 w-full px-6 tablet-xl:gap-4 tablet-s:px-0">
        <input
          type="text"
          className="rounded-2xl bg-white/70 border-transparent px-4 py-4 grow min-w-0 text-[#005271] text-lg border-none focus:outline-none focus:ring-0 placeholder:text-[#005271] disabled:opacity-60 tablet-s:text-sm tablet-s:py-2"
          placeholder="#####"
          value={teamNumber}
          onChange={(e) => setTeamNumber(e.target.value)}
          disabled
        />
        <button
          className="text-white font-semibold text-lg flex justify-center items-center px-6 py-3 rounded-lg bg-[#005271] cursor-pointer grow disabled:opacity-30"
          disabled={!hasTeamNumber}
          onClick={() => setValue(tableNumber)}
        >
          Yes! <Image src={modalArrow} alt="" className="ml-2" />
        </button>
      </div>

      {/* Not my team */}
      <button
        className="text-white text-center text-lg font-semibold rounded-full opacity-50 bg-[#005271] px-6 py-1.5"
        onClick={() => {
          setTableNumber(null);
          setTeamNumber('');
        }}
      >
        Wait! This is not my team
      </button>
    </div>
  );

  const displayMap = {
    init: inputStage,
    loading: loadingStage,
    confirm: confirmStage,
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center px-[15px] z-[101]">
      <div className="w-full">{displayMap[stage]}</div>
    </div>
  );
}
