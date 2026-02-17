'use client';

import Image from 'next/image';

export default function EarlyAccessCard() {
  return (
    <div className="w-full flex justify-center py-12">
      <div
        className="relative w-screen h-screen mx-[5%] mb-[5%] overflow-hidden flex items-center justify-center"
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
          className="object-cover pointer-events-none select-none z-0"
          priority
        />

        {/* Glass Text Box */}
        <div>
            <Image
                src="/Hero/Stars.svg"
                alt="Background"
                fill
                className="object-contain pointer-events-none select-none z-0"
                priority
            />
            <Image
                src="/Hero/Cow.svg"
                alt="Background"
                fill
                className="object-contain pointer-events-none select-none z-0"
                priority
            />
            <div className="relative z-10 w-[80%] max-w-[620px] flex flex-col rounded-2xl bg-white/40 backdrop-blur-xl border border-white/30 shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-black]">
                Welcome Hacker,
            </h2>

            <p className="mt-4 text-base md:text-lg text-black leading-relaxed">
                It seems like you’re here a little early…check back in the hackerhub
                in March for more information!
            </p>
            </div>
        </div>
      </div>
    </div>
  );
}
