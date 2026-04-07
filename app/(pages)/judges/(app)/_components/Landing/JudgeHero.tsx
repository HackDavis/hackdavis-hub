'use client';

import Image from 'next/image';

import green from '@public/judges/landing/just_green.svg';
import froggy from '@public/judges/landing/peeking_froggie.svg';
import pink from '@public/judges/landing/pink.svg';
import yellow from '@public/judges/landing/yellow.svg';

import pink_circle from '@public/judges/landing/pink_cirlces.svg';
import blue_flower from '@public/judges/landing/blue_flower.svg';

import { Button } from '@pages/_globals/components/ui/button';
import useActiveUser from '@pages/_hooks/useActiveUser';

export default function JudgeHero() {
  const { user } = useActiveUser('/judges/login');
  const judgeName = user?.name?.split(' ')[0] ?? 'Judge';

  return (
    <div className="h-[100vh] w-full relative flex justify-center py-[15px]">
      <div className="absolute z-3 h-[95%] w-full bg-white overflow-hidden rounded-[32px]">
        <div className="relative w-full overflow-visible">
          <Image src={green} alt="green" className="w-full -mt-[10%] block" />
          <Image
            src={froggy}
            alt="froggy"
            className="absolute z-10 w-[200px] left-1/2 -translate-x-[25%] bottom-0 translate-y-[20%] pointer-events-none"
          />
        </div>
        <div className="m-[25px] ml-[65px] text-[#3F3F3F] gap-[4px]">
          <p className="text-[22px] font-semibold">Welcome {judgeName},</p>
          <p className="text-[18px]">
            We appreciate you for helping us judge one of California’s biggest
            hackathons!
          </p>
        </div>
        <Image
          src={pink}
          alt="pink"
          className="w-[440px] max-w-none ml-[65px]"
        />
        <Image
          src={yellow}
          alt="yellow"
          className="w-[255px] translate-x-[60%] translate-y-[10%]"
        />

        <Image
          src={blue_flower}
          alt="blue flower"
          className="absolute left-[-12%] top-[14%] animate-spinning-clockwise"
        />
        <Image
          src={pink_circle}
          alt="pink circle"
          className="absolute bottom-[-80px] left-[-65px] animate-spinning-counterclockwise"
        />
      </div>
      <Button
        onClick={() => {
          const cardsSection = document.getElementById('cards');
          if (!cardsSection) return;
          const targetTop =
            cardsSection.getBoundingClientRect().top + window.scrollY - 24;
          window.scrollTo({
            top: Math.max(targetTop, 0),
            behavior: 'smooth',
          });
        }}
        className="absolute z-5 bottom-[3px] bg-[#121212] font-semibold rounded-full px-[24px] py-[10px] outline outline-white outline-[8px] text-[14px]"
      >
        SCROLL DOWN
      </Button>
    </div>
  );
}
