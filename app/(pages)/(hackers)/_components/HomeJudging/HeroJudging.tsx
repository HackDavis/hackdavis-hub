'use client';

import Image from 'next/image';
import JudgeBanners from './_components/JudgeBanners';
import useTableNumberContext from '@pages/_hooks/useTableNumberContext';
import { GoArrowRight } from 'react-icons/go';
import { LuEye } from 'react-icons/lu';

export default function HeroJudging() {
  const { storedValue: tableNumber } = useTableNumberContext();

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
            className="text-center font-medium tracking-[2.4px]"
            style={{
              color: 'rgba(255,255,255,0.9)',
              fontFamily: '"Plus Jakarta Sans"',
              fontSize: '120px',
              textShadow: '0 0 31.729px rgba(255,255,255,0.40)',
            }}
          >
            TABLE {tableNumber ?? '---'}
          </div>
          <JudgeBanners />
          <div className="flex w-full justify-between text-white text-sm md:text-base font-semibold">
            <div className="flex items-center gap-2 max-w-[45%]">
              <GoArrowRight className="text-lg" />
              <p className="cursor-pointer">
                Learn more about our judging process
              </p>
              <p className="underline cursor-pointer">
                here
              </p>
            </div>

            <div className="flex items-center gap-2 max-w-[45%]">
              <LuEye className="text-lg" />
              <p className="underline underline-offset-4 cursor-pointer">
                View previous judges
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}