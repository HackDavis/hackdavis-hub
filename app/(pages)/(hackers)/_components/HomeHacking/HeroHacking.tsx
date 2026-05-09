'use client';

import Image from 'next/image';
// import { GoArrowRight } from 'react-icons/go';
import Countdown from './_components/Countdown';
import clouds from '@public/hackers/hero/Clouds.svg';
// import starLeft from '@public/hackers/hero/StarLeft.svg';
// import startRight from '@public/hackers/hero/StarRight.svg';
// import peepingBunny from '@public/hackers/hero/PeepingBunny.gif';
// import peepingCow from '@public/hackers/hero/PeepingCow.gif';
// import peepingDuck from '@public/hackers/hero/PeepingDuck.gif';
// import peepingFrog from '@public/hackers/hero/PeepingFrog.gif';

interface HeroHackingProps {
  rolloutTime?: number;
  loading?: boolean;
}

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export default function HeroHacking({
  rolloutTime,
  loading,
}: HeroHackingProps) {
  // Adds one day to rollout time 'hacking-starts' AKA hacking ending time
  const countdownTarget = rolloutTime ? rolloutTime + ONE_DAY_MS : undefined;

  return (
    <div className="w-full pt-5 px-10 pb-3">
      <div className="relative w-full max-h-[25vh] overflow-hidden">
        {/* content wrapper */}
        <div className="relative z-10 w-full mx-auto h-[25vh] min-h-0 flex flex-col justify-center gap-3 md:grid md:grid-rows-[minmax(1,1fr)] md:gap-5">
          {/* Countdown bar */}
          <div
            className="relative flex flex-col justify-center rounded-[20px] md:rounded-[32px] backdrop-blur-xl px-6 md:px-10 py-8 md:py-10 overflow-hidden"
            style={{
              background:
                'linear-gradient(172deg, #46D8E9 43.03%, #76DEEB 63.28%, #FCFCD1 112.36%)',
            }}
          >
            {/* background */}
            <Image
              src={clouds}
              alt="Background"
              fill
              className="object-cover pointer-events-none select-none -z-10"
            />

            <div className="flex items-start justify-between gap-2">
              {/* Right: countdown (big) */}
              <div className="flex-1 flex justify-center">
                <div className="text-white relative">
                  <Countdown countdownTarget={countdownTarget} />
                  {loading && (
                    <div className="absolute top-full mt-2 text-white/90 text-sm">
                      loading…
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* end main grid area */}
      </div>
    </div>
  );
}
