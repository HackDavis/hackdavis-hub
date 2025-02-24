'use client';
import Image from 'next/image';

import BunnyPlatform from '@public/Waterfall/bunny_platform.svg';
import Bunny from '@public/Waterfall/bunny.svg';
import CowPlatform from '@public/Waterfall/cow_platform.svg';
import Cow from '@public/Waterfall/cow.svg';
import DuckPlatform from '@public/Waterfall/duck_platform.svg';
import FrogPlatform from '@public/Waterfall/frog_platform.svg';
import KeyboardDucky from '@public/Waterfall/keyboard_ducky.svg';
import SleepingFroggy from '@public/Waterfall/sleeping_froggy.svg';
import MusicNotes from '@public/Waterfall/music_notes.svg';
import WaterfallGrass from '@public/Waterfall/waterfall_grass.svg';
import WaterfallSplash from '@public/Waterfall/waterfall_splash.svg';
import WaterfallImage from '@public/Waterfall/waterfall.svg';

export default function Waterfall() {
  return (
    <div className="relative flex w-full h-[calc(100vw*239/375)] overflow-x-clip flex-col items-center justify-evenly lg:bg-grass-background-darker lg:w-full lg:h-[calc(100vw*600/1440)] z-10">
      {/* Top div with WaterfallGrass */}
      <div className="absolute top-[-26.5%] w-0 lg:w-[100%] aspect-[1440/463]">
        <Image src={WaterfallGrass} alt="Waterfall Grass" className="w-full" />
      </div>

      {/* Bottom div with three sections in a row */}
      <div className="w-0 h-0 lg:h-auto lg:w-full flex justify-between items-start z-10">
        {/* Leftmost item */}
        <div className="flex flex-col space-y-2 flex-1">
          <div className="relative z-30 aspect-[245/271] w-0 lg:w-[calc(100vw*245/1440)] left-[calc(100vw*150/1440)] translate-y-[calc(-1*100vw*40/1440)]">
            <Image src={Bunny} alt="Bunny" className="w-full" />
          </div>
          <div className="relative z-30 aspect-[464/286] w-0 lg:w-[calc(100vw*464/1440)] translate-y-[calc(-1*100vw*80/1440)]">
            <Image
              src={BunnyPlatform}
              alt="Bunny Platform"
              className="w-full"
            />
          </div>
          <div className="relative z-40 aspect-[169/222] w-0 lg:w-[calc(100vw*169/1440)] left-[calc(100vw*239/1440)] translate-y-[calc(-1*100vw*360/1440)]">
            <Image src={Cow} alt="Cow" className="w-full" />
          </div>
          <div className="relative z-30 aspect-[509/210] w-0 lg:w-[calc(100vw*509/1440)] translate-y-[calc(-1*100vw*425/1440)]">
            <Image src={CowPlatform} alt="Cow Platform" className="w-full" />
          </div>
        </div>

        {/* Middle Item */}
        <div className="relative z-10 aspect-[206/700] w-0 lg:w-[calc(100vw*206/1440)] translate-y-[calc(-1*100vw*5/1440)] 2xl:translate-y-[calc(-1*100vw*5/1440)]">
          <Image src={WaterfallImage} className="w-full" alt="Waterfall" />
        </div>

        {/* Rightmost item */}
        <div className="flex flex-col items-end space-y-2 flex-1 z-10 top-[calc(100vw*240/1440)]">
          <div className="relative z-10 aspect-[226/239] w-0 lg:w-[calc(100vw*226/1440)] right-[calc(100vw*154/1440)] translate-y-[calc(100vw*170/1440)]">
            <Image
              src={KeyboardDucky}
              alt="Keyboard Ducky"
              className="w-full"
            />
          </div>
          <div className="relative z-20 aspect-[480/153] w-0 lg:w-[calc(100vw*480/1440)] translate-y-[calc(100vw*130/1440)]">
            <Image src={DuckPlatform} alt="Duck Platform" className="w-full" />
          </div>
          <div className="relative z-40 aspect-[260/152] w-0 lg:w-[calc(100vw*260/1440)] right-[calc(100vw*190/1440)] translate-y-[calc(-1*100vw*15/1440)]">
            <Image
              src={SleepingFroggy}
              alt="Sleeping Froggy"
              className="w-full"
            />
          </div>
          <div className="relative z-30 asect-[506/293] w-0 lg:w-[calc(100vw*506/1440)] translate-y-[calc(-1*100vw*100/1440)]">
            <Image src={FrogPlatform} alt="Frog Platform" className="w-full" />
          </div>
        </div>
      </div>

      <div className="relative z-20 aspect-[536/220] w-0 lg:w-[calc(100vw*536/1440)] lg:translate-y-[calc(-1*100vw*560/1440)]">
        <Image
          src={WaterfallSplash}
          alt="Waterfall Splash"
          className="w-full"
        />
      </div>

      <div className="relative z-10 aspect-[134/164] w-0 lg:w-[calc(100vw*134/1440)] left-[calc(100vw*300/1440)] translate-y-[calc(-1*100vw*1150/1440)]">
        <Image src={MusicNotes} alt="Music Notes" className="w-full" />
      </div>

      <div className="relative z-10 aspect-[226/239] w-[calc(100vw*226/375)] bottom-[4%] sm:bottom-[-5%] right-[calc(100vw*40/375)] lg:w-0">
        <Image
          src={KeyboardDucky}
          alt="Keyboard Ducky"
          className="w-full"
        />
      </div>
    </div>
  );
}
