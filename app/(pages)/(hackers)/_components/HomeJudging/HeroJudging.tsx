'use client';

import Image from 'next/image';
import JudgeBanners from './_components/JudgeBanners';
import useTableNumberContext from '@pages/_hooks/useTableNumberContext';

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
        <div className="relative w-[90%] max-w-[900px] flex flex-col items-center justify-center gap-6">
          <div className="text-white text-4xl md:text-5xl font-semibold drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)] text-center">
            TABLE {tableNumber ?? '---'}
          </div>
          <JudgeBanners />
          <div className="flex w-full justify-between text-white text-sm md:text-base">
            <p className="max-w-[45%] text-left">
              Learn more about our judging process here
            </p>
            <p className="max-w-[45%] text-right">View previous judges</p>
          </div>
        </div>
      </div>
    </div>
  );
}