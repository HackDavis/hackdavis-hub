'use client';

import Image from 'next/image';
import { GoArrowRight } from 'react-icons/go';

import { useRollout } from '@pages/_hooks/useRollout';
import ClientTimeProtectedDisplay from '@pages/_components/TimeProtectedDisplay/ClientTimeProtectedDisplay';
import Countdown from './_components/Countdown';

export default function HeroHacking() {
  const { loading, rolloutRes, fetchRollout } = useRollout('hacking-starts');

  // If rollout hasn't returned yet, render the hero shell + a fallback countdown
  const hasRollout =
    !!rolloutRes &&
    (rolloutRes as any).ok &&
    (rolloutRes as any).body?.rollout_time;

  const countdownTarget = hasRollout
    ? (rolloutRes as any).body.rollout_time + 24 * 60 * 60 * 1000
    : undefined;

  return (
    <div className="w-full h-screen p-4 md:p-10">
      <div className="relative w-full h-full overflow-hidden">
        {/* content wrapper */}
        <div className="relative z-10 w-full">
          {/* Main grid area */}
          <div className="mx-auto h-[90vh] min-h-0 flex flex-col justify-center gap-3 md:grid md:grid-rows-[auto_minmax(0,1fr)] md:gap-5">
            {' '}
            {/* Countdown bar */}
            <div
              className="relative flex flex-col justify-center rounded-[20px] md:rounded-[32px] bg-white/25 backdrop-blur-xl px-6 md:px-10 py-8 md:py-10 overflow-hidden"
              style={{
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

              <div className="flex items-start justify-between gap-2">
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

                    {loading && (
                      <div className="mt-2 text-white/90 text-sm text-right">
                        loading…
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Everything below countdown must fit remaining height */}
            <div className="relative min-h-0">
              {/* Decorative stars */}
              <Image
                src="/hackers/hero/StarLeft.svg"
                alt=""
                width={120}
                height={120}
                className="
                    pointer-events-none select-none
                    absolute z-20
                    -left-2 top-[35%] md:top-[50%]
                    w-[56px] sm:w-[70px] md:w-[84px] lg:w-[96px]
                    rotate-[-8deg]
                  "
              />

              <Image
                src="/hackers/hero/StarRight.svg"
                alt=""
                width={120}
                height={120}
                className="
                    pointer-events-none select-none
                    absolute z-20
                    -right-2 top-[10%]
                    w-[56px] sm:w-[70px] md:w-[84px] lg:w-[96px]
                    rotate-[10deg]
                  "
              />
              {/* ===================== MOBILE (2x2 animals) ===================== */}
              <div className="md:hidden h-full flex flex-col justify-center">
                {/* 2x2 animals */}
                <div className="grid grid-cols-2 gap-2">
                  {/* Cow */}
                  <div className="relative rounded-[20px] bg-[#93F5F3] overflow-hidden flex items-end justify-center">
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
                  <div className="relative rounded-[20px] bg-[#FFF3B6] overflow-hidden flex items-end justify-center">
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
                  <div className="relative rounded-[20px] bg-[#E9FBBA] overflow-hidden flex items-end justify-center">
                    <Image
                      src="/hackers/hero/PeepingFrog.svg"
                      alt="Peeking frog"
                      width={520}
                      height={320}
                      className="w-[65%] h-auto pointer-events-none select-none"
                    />
                  </div>

                  {/* Bunny */}
                  <div className="relative rounded-[20px] bg-[#FFD2D2] overflow-hidden flex items-end justify-center">
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
                  className="mt-2 group relative rounded-[1000px] bg-white/25 backdrop-blur-xl min-h-[110px] flex items-center justify-center overflow-hidden"
                  style={{
                    background:
                      'linear-gradient(172deg, #46D8E9 43.03%, #76DEEB 63.28%, #FCFCD1 112.36%)',
                  }}
                >
                  {/* background */}
                  <Image
                    src="/Hero/Clouds.svg"
                    alt="Background"
                    fill
                    className="object-cover pointer-events-none select-none -z-10 overflow-hidden"
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

              {/* ===================== DESKTOP (dynamically fits remaining height) ===================== */}
              <div className="hidden md:grid min-h-0 h-full grid-rows-[minmax(0,1fr)_minmax(0,1fr)] gap-5">
                {/* Row 1: 3 tiles */}
                <div className="min-h-0 grid grid-cols-[50fr_30fr_20fr] gap-5">
                  {/* Cow */}
                  <div className="min-h-0 relative rounded-[28px] bg-[#93F5F3] backdrop-blur-xl overflow-hidden flex items-end justify-center">
                    <Image
                      src="/hackers/hero/PeepingCow.svg"
                      alt="Peeking cow"
                      width={520}
                      height={320}
                      className="w-[55%] max-h-full h-auto pointer-events-none select-none"
                      priority
                    />
                  </div>

                  {/* Duck */}
                  <div className="min-h-0 relative rounded-[28px] bg-[#FFF3B6] overflow-hidden flex items-end justify-center">
                    <Image
                      src="/hackers/hero/PeepingDuck.svg"
                      alt="Peeking duck"
                      width={520}
                      height={320}
                      className="w-[100%] max-h-full h-auto pointer-events-none select-none"
                      priority
                    />
                  </div>

                  {/* Frog */}
                  <div className="min-h-0 relative rounded-[28px] bg-[#E9FBBA] backdrop-blur-xl overflow-hidden flex items-end justify-center">
                    <Image
                      src="/hackers/hero/PeepingFrog.svg"
                      alt="Peeking frog"
                      width={520}
                      height={320}
                      className="w-[90%] max-h-full h-auto pointer-events-none select-none"
                    />
                  </div>
                </div>

                {/* Row 2: bunny + submit pill */}
                <div className="min-h-0 grid grid-cols-[1fr_2fr] gap-5 items-stretch">
                  {/* Bunny */}
                  <div className="min-h-0 relative rounded-[28px] bg-[#FFD2D2] backdrop-blur-xl overflow-hidden flex items-end justify-center">
                    <Image
                      src="/hackers/hero/PeepingBunny.svg"
                      alt="Peeking bunny"
                      width={520}
                      height={320}
                      className="w-[85%] max-h-full h-auto pointer-events-none select-none"
                    />
                  </div>

                  {/* Submit pill */}
                  <a
                    href="https://hackdavis-2026.devpost.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="group relative rounded-full bg-white/25 backdrop-blur-xl flex items-center justify-center overflow-hidden"
                    style={{
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
                      <span
                        className="text-white font-medium tracking-[4.601px]"
                        style={{
                          fontSize: 'clamp(28px, 6vw, 90px)',
                          textShadow: '0 0 31.729px rgba(255, 255, 255, 0.30)',
                        }}
                      >
                        SUBMIT
                      </span>

                      <GoArrowRight
                        className="text-white transition-transform duration-300 group-hover:translate-x-3"
                        style={{
                          fontSize: 'clamp(40px, 5vw, 120px)',
                          textShadow: '0 0 31.729px rgba(255, 255, 255, 0.30)',
                        }}
                      />
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
          {/* end main grid area */}
        </div>
      </div>
    </div>
  );
}
