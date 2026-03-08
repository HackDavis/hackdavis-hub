'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import JudgeBanners from './_components/JudgeBanners';
import useTableNumberContext from '@pages/_hooks/useTableNumberContext';
import { GoArrowRight } from 'react-icons/go';
import { LuEye, LuEyeOff } from 'react-icons/lu';
import HeroWaiting from './HeroWaiting';

export default function HeroJudging() {
  const { storedValue: tableNumber } = useTableNumberContext();
  const [showPreviousJudges, setShowPreviousJudges] = useState(false);

  if (!tableNumber) {
    return <HeroWaiting />;
  }

  return (
    <div className="w-full h-screen p-4 md:p-10">
      <div
        className="relative w-full h-full overflow-hidden flex items-center justify-center"
        style={{
          borderRadius: '38.812px',
          background:
            'linear-gradient(172deg, #46D8E9 43.03%, #76DEEB 63.28%, #FCFCD1 112.36%)',
        }}
      >
        <Image
          src="/Hero/Clouds.svg"
          alt="Background"
          fill
          className="object-cover pointer-events-none select-none"
          priority
        />
        <div className="relative w-[90%] max-w-[900px] flex flex-col items-center justify-center">
          <div
            className="text-center font-medium tracking-[2.4px] 
                    text-[48px] sm:text-[64px] md:text-[90px] lg:text-[120px]"
            style={{
              color: 'rgba(255,255,255,0.9)',
              fontFamily: '"Plus Jakarta Sans"',
              textShadow: '0 0 31.729px rgba(255,255,255,0.40)',
            }}
          >
            TABLE {tableNumber ?? '---'}
          </div>
          <div className="relative w-full mt-2">
            <div
              className={`transition duration-300 ${
                !showPreviousJudges ? 'blur-[3px]' : ''
              }`}
            >
              <JudgeBanners />
            </div>
          </div>
          <div className="flex flex-col md:flex-row w-full text-white text-sm md:text-base font-semibold mt-4 gap-3 md:gap-0 md:justify-between">
            {/* Previous Judges (top on mobile) */}
            <button
              type="button"
              onClick={() => setShowPreviousJudges((prev) => !prev)}
              className="flex items-center gap-2 md:max-w-[45%] underline underline-offset-4 cursor-pointer md:justify-end md:order-2"
            >
              {showPreviousJudges ? (
                <LuEyeOff className="text-lg" />
              ) : (
                <LuEye className="text-lg" />
              )}
              <span>
                {showPreviousJudges
                  ? 'Hide previous judges'
                  : 'View previous judges'}
              </span>
            </button>

            {/* Judging Process */}
            <Link
              href="/project-info#judging"
              className="flex items-center gap-2 md:max-w-[45%] md:order-1"
            >
              <GoArrowRight className="text-lg" />
              <span>
                Learn more about our judging process{' '}
                <span className="underline underline-offset-4">here</span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
