'use client';

import { useEffect } from 'react';
import Image from 'next/image';
// import { LuArrowUpRight } from 'react-icons/lu';
import { GoArrowRight } from 'react-icons/go';

import { useRollout } from '@pages/_hooks/useRollout';
import ClientTimeProtectedDisplay from '@pages/_components/TimeProtectedDisplay/ClientTimeProtectedDisplay';
import Countdown from './_components/Countdown';

export default function IndexHeroContentHacking() {
  const { loading, rolloutRes, fetchRollout } = useRollout('hacking-starts');

  // Ensure rollout data is fetched on mount (prevents "loading forever" -> blank render)
  useEffect(() => {
    fetchRollout('hacking-starts');
  }, [fetchRollout]);

  // If rollout hasn't returned yet, render the hero shell + a fallback countdown
  const hasRollout =
    !!rolloutRes &&
    (rolloutRes as any).ok &&
    (rolloutRes as any).body?.rollout_time;

  const countdownTarget = hasRollout
    ? (rolloutRes as any).body.rollout_time + 24 * 60 * 60 * 1000
    : undefined;

  // If rollout errored, still render the hero (so the page isn't blank) and show error text
  // const rolloutError =
  //   rolloutRes && !(rolloutRes as any).ok ? (rolloutRes as any).error : null;

  return (
    <div className="w-full min-h-screen p-4 md:p-10">
      <div
        className="relative w-full min-h-[86vh] overflow-hidden"
      >

        {/* content wrapper */}
        <div className="relative z-10 w-full h-full px-4 md:px-10 py-[15%] md:py-10">
          {/* Main grid area */}
          <div className="mx-auto mt-6 md:mt-8 w-full max-w-[1200px]">
            {/* Countdown bar */}
            <div className="rounded-[28px] bg-white/25 backdrop-blur-xl border border-white/35 shadow-[0_10px_30px_rgba(0,0,0,0.08)] px-6 md:px-10 py-8 md:py-10"
              style={{
                borderRadius: '38.812px',
                background:
                  'linear-gradient(172deg, #46D8E9 43.03%, #76DEEB 63.28%, #FCFCD1 112.36%)',
              }}>
              <div className="flex items-start justify-between gap-6">
                {/* background */}
                <Image
                  src="/Hero/Clouds.svg"
                  alt="Background"
                  fill
                  className="object-cover pointer-events-none select-none -z-10"
                  priority
                />
                {/* Right: countdown (big) */}
                <div className="flex-1 flex justify-center">
                  <div className="text-white">
                    <ClientTimeProtectedDisplay
                      featureId="hacking-starts"
                      fallback={<Countdown />}
                      callback={() => fetchRollout('hacking-starts')}
                    >
                      {hasRollout && countdownTarget ? (
                        <Countdown countdownTarget={countdownTarget} />
                      ) : (
                        <Countdown />
                      )}
                    </ClientTimeProtectedDisplay>

                    {/* If the hook is still loading, show a subtle hint (won't affect layout much) */}
                    {loading && (
                      <div className="mt-2 text-white/90 text-sm text-right">
                        loading…
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* ===================== MOBILE (2x2 animals) ===================== */}
            <div className="mt-2 md:hidden">
              {/* 2x2 animals */}
              <div className="grid grid-cols-2 gap-2">
                {/* Cow */}
                <div className="relative rounded-[28px] bg-[#93F5F3] border border-white/35 shadow-[0_10px_30px_rgba(0,0,0,0.08)] overflow-hidden flex items-end justify-center">
                  <Image
                    src="/hackers/hero/PeepingCow.svg"
                    alt="Peeking cow"
                    width={520}
                    height={320}
                    className="w-[85%] h-auto pointer-events-none select-none"
                    priority
                  />
                </div>

                {/* Duck */}
                <div className="relative rounded-[28px] bg-[#FFF3B6] border border-white/35 shadow-[0_10px_30px_rgba(0,0,0,0.08)] overflow-hidden flex items-end justify-center">
                  <Image
                    src="/hackers/hero/PeepingDuck.svg"
                    alt="Peeking duck"
                    width={520}
                    height={320}
                    className="w-[100%] h-auto pointer-events-none select-none"
                    priority
                  />
                </div>

                {/* Frog */}
                <div className="relative rounded-[28px] bg-[#E9FBBA] border border-white/35 shadow-[0_10px_30px_rgba(0,0,0,0.08)] overflow-hidden flex items-end justify-center">
                  <Image
                    src="/hackers/hero/PeepingFrog.svg"
                    alt="Peeking frog"
                    width={520}
                    height={320}
                    className="w-[65%] h-auto pointer-events-none select-none"
                  />
                </div>

                {/* Bunny */}
                <div className="relative rounded-[28px] bg-[#FFD2D2] border border-white/35 shadow-[0_10px_30px_rgba(0,0,0,0.08)] overflow-hidden flex items-end justify-center">
                  <Image
                    src="/hackers/hero/PeepingBunny.svg"
                    alt="Peeking bunny"
                    width={520}
                    height={320}
                    className="w-[85%] h-auto pointer-events-none select-none"
                  />
                </div>
              </div>

              {/* Submit pill under grid on mobile */}
              <a
                href="https://hackdavis-2026.devpost.com/"
                target="_blank"
                rel="noreferrer"
                className="mt-2 group relative rounded-[999px] bg-white/25 backdrop-blur-xl border border-white/35 shadow-[0_10px_30px_rgba(0,0,0,0.08)] min-h-[110px] flex items-center justify-center overflow-hidden"
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
                  className="object-cover pointer-events-none select-none -z-10"
                  priority
                />
                <div className="absolute inset-0 opacity-70 pointer-events-none bg-gradient-to-r from-white/0 via-white/10 to-white/0" />
                <div className="relative flex items-center gap-2">
                  <span className="text-white text-4xl md:text-5xl font-extrabold tracking-wide drop-shadow-[0_6px_14px_rgba(0,0,0,0.18)]">
                    SUBMIT!
                  </span>
                  <GoArrowRight className="text-white text-4xl md:text-5xl drop-shadow-[0_6px_14px_rgba(0,0,0,0.18)] transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </a>
            </div>

            {/* ===================== DESKTOP (original layout) ===================== */}
            <div className="hidden md:block">
              {/* Middle row: 3 tiles */}
              <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-[50fr_30fr_20fr]">
                {/* Cow */}
                <div className="relative rounded-[28px] bg-[#93F5F3] backdrop-blur-xl border border-white/35 shadow-[0_10px_30px_rgba(0,0,0,0.08)] overflow-hidden min-h-[180px] flex items-end justify-center">
                  <Image
                    src="/hackers/hero/PeepingCow.svg"
                    alt="Peeking cow"
                    width={520}
                    height={320}
                    className="w-[55%] h-auto pointer-events-none select-none"
                    priority
                  />
                </div>

                {/* Duck */}
                <div className="relative rounded-[28px] bg-[#FFF3B6] border border-white/35 shadow-[0_10px_30px_rgba(0,0,0,0.08)] overflow-hidden min-h-[180px] flex items-end justify-center">
                  <Image
                    src="/hackers/hero/PeepingDuck.svg"
                    alt="Peeking duck"
                    width={520}
                    height={320}
                    className="w-[100%] h-auto pointer-events-none select-none"
                    priority
                  />
                </div>

                {/* Frog */}
                <div className="relative rounded-[28px] bg-[#E9FBBA] backdrop-blur-xl border border-white/35 shadow-[0_10px_30px_rgba(0,0,0,0.08)] overflow-hidden min-h-[180px] flex items-end justify-center">
                  <Image
                    src="/hackers/hero/PeepingFrog.svg"
                    alt="Peeking frog"
                    width={520}
                    height={320}
                    className="w-[90%] h-auto pointer-events-none select-none"
                  />
                </div>
              </div>

              {/* Bottom row: bunny + submit pill (unchanged) */}
              <div className="mt-6 grid grid-cols-[1fr_2fr] gap-5 items-stretch">
                {/* Bunny */}
                <div className="relative rounded-[28px] bg-[#FFD2D2] backdrop-blur-xl border border-white/35 shadow-[0_10px_30px_rgba(0,0,0,0.08)] overflow-hidden min-h-[170px] flex items-end justify-center">
                  <Image
                    src="/hackers/hero/PeepingBunny.svg"
                    alt="Peeking bunny"
                    width={520}
                    height={320}
                    className="w-[85%] h-auto pointer-events-none select-none"
                  />
                </div>

                {/* Submit pill */}
                <a
                  href="https://hackdavis-2026.devpost.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="group relative rounded-[999px] bg-white/25 backdrop-blur-xl border border-white/35 shadow-[0_10px_30px_rgba(0,0,0,0.08)] min-h-[170px] flex items-center justify-center overflow-hidden"
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
                    className="object-cover pointer-events-none select-none -z-10"
                    priority
                  />
                  <div className="absolute inset-0 opacity-70 pointer-events-none bg-gradient-to-r from-white/0 via-white/10 to-white/0" />
                  <div className="relative flex items-center gap-6">
                    <span className="text-white text-5xl md:text-7xl font-extrabold tracking-wide drop-shadow-[0_6px_14px_rgba(0,0,0,0.18)]">
                      SUBMIT!
                    </span>
                    <GoArrowRight className="text-white text-5xl md:text-6xl drop-shadow-[0_6px_14px_rgba(0,0,0,0.18)] transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
