'use client';

import Image from 'next/image';
import JudgeBanners from '../2025IndexHero/JudgeBanners';

export default function HeroJudging() {
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
        {/* background */}
        <Image
          src="/Hero/Clouds.svg"
          alt="Background"
          fill
          className="object-cover pointer-events-none select-none"
          priority
        />

        {/* scene wrapper */}
        <div className="relative w-[90%] max-w-[900px] border-2 border-red-500 flex items-center justify-center">
          {/* stars */}
          <JudgeBanners />
        </div>
      </div>
    </div>
  );
}

