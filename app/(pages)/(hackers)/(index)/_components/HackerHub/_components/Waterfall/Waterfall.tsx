'use client';
import Image from 'next/image';

import BunnyPlatform from '@public/Waterfall/bunny_platform.svg';
import Bunny from '@public/Waterfall/bunny.svg';
import CowPlatform from '@public/Waterfall/cow_platform.svg';
import Cow from '@public/Waterfall/cow.svg';
import DuckPlatform from '@public/Waterfall/bunny_platform.svg';
import FrogPlatform from '@public/Waterfall/frog_platform.svg';
import KeyboardDucky from '@public/Waterfall/keyboard_ducky.svg';
import SleepingFroggy from '@public/Waterfall/sleeping_froggy.svg';
import MusicNotes from '@public/Waterfall/music_notes.svg';
import WaterfallGrass from '@public/Waterfall/waterfall_grass.svg';
import WaterfallSplash from '@public/Waterfall/waterfall_splash.svg';
import WaterfallImage from '@public/Waterfall/waterfall.svg';

export default function Waterfall() {
  return (
    <div className="relative flex w-full flex-col items-center justify-evenly overflow-hidden bg-grass-background-darker">
      {/* Top div with WaterfallGrass */}
      <div className="w-full relative">
        <Image src={WaterfallGrass} alt="Waterfall Grass" layout="responsive" />
      </div>

      {/* Bottom div with three sections in a row */}
      <div className="w-full flex justify-between items-start">
        {/* Leftmost item */}
        <div className="flex flex-col items-center space-y-2 flex-1">
          <div className="relative z-30">
            <Image src={Bunny} alt="Bunny" />
          </div>
          <div className="relative z-20">
            <Image src={BunnyPlatform} alt="Bunny Platform" />
          </div>
          <div className="relative z-40">
            <Image src={Cow} alt="Cow" />
          </div>
          <div className="relative z-30">
            <Image src={CowPlatform} alt="Cow Platform" />
          </div>
          
        </div>

        {/* Middle Item */}
        <div
          className="flex flex-col items-center flex-none"
          style={{ width: 206, height: 700 }}
        >
          <div className="relative z-10 w-full h-full">
            <Image
              src={WaterfallImage}
              alt="Waterfall"
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="relative z-100">
            <Image src={WaterfallSplash} alt="Waterfall Splash" />
          </div>
        </div>

        {/* Rightmost item */}
        <div className="flex flex-col items-center space-y-2 flex-1">
          <div className="relative z-10">
            <Image src={MusicNotes} alt="Music Notes" />
          </div>
          <div className="relative z-10">
            <Image src={KeyboardDucky} alt="Keyboard Ducky" />
          </div>
          <div className="relative z-20">
            <Image src={DuckPlatform} alt="Duck Platform" />
          </div>
          <div className="relative z-40">
            <Image src={SleepingFroggy} alt="Sleeping Froggy" />
          </div>
          <div className="relative z-30">
            <Image src={FrogPlatform} alt="Frog Platform" />
          </div>
        </div>
      </div>
    </div>
  );
}
