'use client';
import Image from 'next/image';

import cloudBottom from '@public/BigVinyl/CloudBottom.svg';
import cloudBottomDim from '@public/BigVinyl/CloudBottomDim.svg';
import cloudCenterLeft from '@public/BigVinyl/CloudCenter.svg';
import cloudCenterRight from '@public/BigVinyl/CloudCenterRight.svg';
import cloudTop from '@public/BigVinyl/CloudTop.svg';
import cloudTopMobile from '@public/BigVinyl/CloudTopMobile.svg';
import vinyl from '@public/BigVinyl/Vinyl_text_style_1.svg';
import sparkles from '@public/BigVinyl/Sparkles.svg';

import musicNotes from '@public/Waterfall/music_notes.svg';
import keyboardDucky from '@public/Waterfall/keyboard_ducky.svg';

export default function BigVinyl() {
  return (
    <div className="relative flex w-full flex-col items-center justify-evenly overflow-hidden bg-gradient-primary">
      {/* First Row */}
      <div className="z-2 relative flex-row hidden h-0 w-full justify-between md:block md:h-[calc((300/1440)*100vw)]">
        {/* Clouds Top Left - Visible on md and up */}
        <div className="relative w-full">
          <div className="z-2 relative aspect-[1069/328] w-[calc(894/1440*100vw)] top-[calc(100vw*15/1440)] left-1/2 md:translate-x-[-127%]">
            <Image
              src={cloudTop}
              alt="Clouds Top Left Layer 1"
              className="h-full w-full"
            />
          </div>
          <div className="relative top-[calc(-1*100vw*275/1440)] aspect-[1117/339] w-[calc(894/1440*100vw)] opacity-90 left-1/2 md:translate-x-[-125%]">
            <Image
              src={cloudTop}
              alt="Clouds Top Left Layer 2"
              className="h-full w-full"
            />
          </div>
        </div>

        {/* Clouds Top Right - Only visible on md, lg, xl, 2xl */}
        <div className="relative hidden left-1/2 translate-x-[15%] translate-y-[-95%] md:block">
          <div className="z-2 relative aspect-[1069/328] w-[calc(1069/1440*100vw)] top-[calc(40/1440*100vw)] scale-x-[-1] transform opacity-100">
            <Image
              src={cloudTop}
              alt="Clouds Top Right Layer 1"
              className="h-full w-full"
            />
          </div>
          <div className="relative top-[calc(-1*328/1440*100vw)] left-[calc(-1*45/1440*100vw)] aspect-[1117/339] w-[calc(1117/1440*100vw)] scale-x-[-1] transform opacity-90">
            <Image
              src={cloudTop}
              alt="Clouds Top Right Layer 2"
              className="h-full w-full"
            />
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="z-1 relative h-0 flex flex-row md:h-[calc(200/1440*100vw)] md:w-full ">
        <div className="relative aspect-[842/248] top-[45%] w-[calc(842/1440*100vw)] left-[calc(100vw*108/1440)] translate-y-[calc(-1*154/1440*100vw)]">
          <Image
            src={cloudCenterLeft}
            alt="Center Cloud Left"
            className="h-full w-full"
          />
        </div>
        <div className="relative aspect-[190/200] top-[45%] w-[calc(190/1440*100vw)] left-[calc(100vw*408/1440)] translate-y-[calc(-1*140/1440*100vw)] opacity-85">
          <Image
            src={cloudCenterRight}
            alt="Center Cloud Right"
            className="h-full w-full"
          />
        </div>
      </div>

      <div className="z-1 relative h-[calc(100vw*200/375)] md:h-0 md:hidden">
        <div className="relative aspect-[190/120] w-[calc(100vw*190/375)] translate-x-[calc(-1*100vw*94/375)]">
          <Image
            src={cloudTopMobile}
            alt="Center Top mobile"
            className="h-full w-full"
          />
        </div>
      </div>

      {/* Third Row - bottom layer of clouds less opaque */}
      <div className="relative flex h-[calc(100vw*190/375)] md:h-[calc(234/1440*100vw)] w-full justify-between z-10">
        {/* Clouds Bottom Left - Only visible on md, lg, xl, 2xl */}
        <div className="left-1/2 hidden w-0 md:w-[calc(842/(2*1440)*100vw)] -translate-x-[80%] flex-col items-start md:flex">
          <div className="z-1 relative top-[calc(-1*34/1440*100vw)] aspect-[842/234] w-[calc(842/1440*100vw)]">
            <Image
              src={cloudBottomDim}
              alt="Clouds Bottom Left Layer 2"
              className="h-full w-full"
            />
          </div>
        </div>

        {/* Clouds Bottom Right - Large till md, Small on md, lg, xl, 2xl */}
        <div className="relative left-1/2 md:translate-y-[20%] md:block">
          <div className="z-10 relative aspect-[674/187] w-[calc(674/375*100vw)] md:aspect-[842/234] md:w-[calc(842/1440*100vw)] md:top-[calc(-1*80/1440*100vw)] translate-x-[-26%] md:translate-x-[-45%] opacity-60">
            <Image
              src={cloudBottom}
              alt="Clouds Bottom Right Layer 2"
              className="h-full w-full"
            />
          </div>
        </div>
      </div>

      {/* Vinyl Row - Large screens center it, Small screens hide it */}
      <div className="relative w-full hidden md:block z-10">
        <div className="animate-rotateVinyl absolute left-[100%] aspect-square w-[150vw] -translate-x-[100%] md:left-[50%] md:w-[70vw] md:-translate-x-1/2 md:-translate-y-[50%]">
          <Image src={vinyl} alt="Big Vinyl Center" className="h-full w-full" />
        </div>
      </div>

      {/* Top layer of clouds */}
      <div className="absolute flex h-[calc(100vw*190/375)] md:top-[calc(500/1440*100vw)] md:h-[calc(234/1440*100vw)] w-full justify-between z-10">
        <div className="left-1/2 hidden w-0 md:w-[calc(842/(2*1440)*100vw)] -translate-x-[80%] flex-col items-start md:flex">
          <div className="relative z-10 aspect-[842/234] w-[calc(842/1440*100vw)]">
            <Image
              src={cloudBottom}
              alt="Clouds Bottom Left Layer 1"
              className="h-full w-full"
            />
          </div>
        </div>
        <div className="relative left-1/2 md:block">
          <div className="relative z-20 aspect-[675/187] w-[calc(100vw*675/375)] top-[calc(100vw*130/375)] md:top-0 md:aspect-[842/234]  md:w-[calc(842/1440*100vw)] translate-x-[-25%] md:translate-x-[-40%] scale-x-[-1] transform">
            <Image
              src={cloudBottom}
              alt="Clouds Bottom Right Layer 1"
              className="h-full w-full"
            />
          </div>
        </div>
      </div>

      {/* Sparkles */}
      <div className="relative flex w-full">
        <div className="absolute w-0 aspect-[1262/315] md:w-[calc(100vw*1262/1440)] left-[calc(-1*100vw*20/1440)] top-[calc(-1*100vw*670/1440)] z-20">
          <Image
            src={sparkles}
            alt="Vinyl Sparkles"
            className="h-full w-full"
          />
        </div>
      </div>

      {/* music notes - sm and below only */}
      <div className="absolute z-10 aspect-[134/164] w-[calc(100vw*134/375)] left-[calc(100vw*80/375)] translate-y-[calc(-1*100vw*100/375)] md:w-0 md:h-0">
        <Image src={musicNotes} alt="Music Notes" className="w-full" />
      </div>

      {/* Keyboard ducky - sm and below only */}
      <div className="absolute z-10 aspect-[227/230] w-[calc(100vw*227/375)] left-[calc(100vw*40/375)] translate-y-[calc(100vw*81/375)] 2xs:translate-y-[calc(100vw*76/375)] xs:translate-y-[calc(100vw*74/375)] sm:translate-y-[calc(100vw*78/375)] md:w-0 md:h-0">
        <Image src={keyboardDucky} alt="Keyboard Ducky" className="w-full" />
      </div>
    </div>
  );
}
