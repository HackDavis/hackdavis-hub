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

export default function BigVinyl() {
  return (
    <div className="relative flex w-full flex-col items-center justify-evenly overflow-hidden bg-cyan-500">
      {/* First Row */}
      <div className="z-2 relative flex hidden lg:block h-0 w-full justify-between lg:h-[calc((328/1440)*100vw-40px)]">
        {/* Clouds Top Left - Always visible */}
        <div className="relative left-1/2 w-full -translate-x-[90%] lg:-translate-x-[110%]">
          <div className="z-2 relative top-[2%] aspect-[1069/328] w-[calc(1069/1440*100vw)] md:top-10">
            <Image
              src={cloudTop}
              alt="Clouds Top Left Layer 1"
              className="h-full w-full"
            />
          </div>
          <div className="relative -top-[calc(328/1440*100vw)] aspect-[1117/339] w-[calc(1117/1440*100vw)] opacity-90">
            <Image
              src={cloudTop}
              alt="Clouds Top Left Layer 2"
              className="h-full w-full"
            />
          </div>
        </div>

        {/* Clouds Top Right - Only visible on lg, xl, 2xl */}
        <div className="relative left-1/2 hidden -translate-x-[85%] -translate-y-[20%] lg:block">
          <div className="z-2 relative top-10 aspect-[1069/328] w-[calc(1069/1440*100vw)] scale-x-[-1] transform">
            <Image
              src={cloudTop}
              alt="Clouds Top Right Layer 1"
              className="h-full w-full"
            />
          </div>
          <div className="relative -top-[calc(328/1440*100vw)] right-12 aspect-[1117/339] w-[calc(1117/1440*100vw)] scale-x-[-1] transform opacity-90">
            <Image
              src={cloudTop}
              alt="Clouds Top Right Layer 2"
              className="h-full w-full"
            />
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="z-1 relative h-0 flex flex-row lg:h-[calc(248/1440*100vw+100px)] lg:w-full ">
        <div className="relative aspect-[842/248] w-0 lg:top-[80px] lg:w-[calc(842/1440*100vw)] lg:left-[calc(100vw*158/1440)] lg:-translate-y-[calc(74/1440*100vw)]">
          <Image
            src={cloudCenterLeft}
            alt="Center Cloud Left"
            className="h-full w-full"
          />
        </div>
        <div className="relative aspect-[190/200] hidden lg:block w-0 lg:top-[80px] lg:w-[calc(190/1440*100vw)] lg:left-[calc(100vw*408/1440)] lg:-translate-y-[calc(74/1440*100vw)]">
          <Image
            src={cloudCenterRight}
            alt="Center Cloud Right"
            className="h-full w-full"
          />
        </div>
      </div>

      <div className="z-1 relative h-[calc(100vw*200/375)] lg:h-0">
        <div className="relative aspect-[190/120] w-[calc(100vw*190/375)] translate-x-[calc(-1*100vw*94/375)]">
          <Image
            src={cloudTopMobile}
            alt="Center Top mobile"
            className="h-full w-full"
          />
        </div>
      </div>

      {/* Third Row */}
      <div className="relative flex h-[calc(100vw*190/375)] lg:h-[calc(234/1440*100vw)] w-full justify-between">
        {/* Clouds Bottom Left - Only visible on lg, xl, 2xl */}
        <div className="left-1/2 hidden w-0 lg:w-[calc(842/(2*1440)*100vw)] -translate-x-[80%] flex-col items-start lg:flex">
          <div className="relative top-10 z-10 aspect-[842/234] w-[calc(842/1440*100vw)]">
            <Image
              src={cloudBottom}
              alt="Clouds Bottom Left Layer 1"
              className="h-full w-full"
            />
          </div>
          <div className="z-1 relative -top-[calc(234/1440*100vw)] aspect-[842/234] w-[calc(842/1440*100vw)]">
            <Image
              src={cloudBottomDim}
              alt="Clouds Bottom Left Layer 2"
              className="h-full w-full"
            />
          </div>
        </div>

        {/* Clouds Bottom Right - Large on up to md, Small on lg, xl, 2xl */}
        <div className="relative left-1/2 lg:translate-y-[20%] lg:block">
          <div className="relative top-9 z-10 aspect-[675/187] top-[calc(100vw*25/375)] lg:top-0 lg:aspect-[842/234] lg:w-[calc(100vw*675/1440)] lg:w-[calc(842/1440*100vw)] translate-x-[-25%] lg:translate-x-[-35%] scale-x-[-1] transform">
            <Image
              src={cloudBottom}
              alt="Clouds Bottom Right Layer 1"
              className="h-full w-full"
            />
          </div>
          <div className="z-1 relative aspect-[674/187] top-[calc(-1*100vw*170/375)] w-[calc(674/375*100vw)] lg:aspect-[842/234] lg:w-[calc(842/1440*100vw)] lg:-top-[calc(234/1440*100vw)] translate-x-[-27%] lg:translate-x-[-35%] opacity-60">
            <Image
              src={cloudBottom}
              alt="Clouds Bottom Right Layer 2"
              className="h-full w-full"
            />
          </div>
        </div>
      </div>

      {/* Vinyl Row - Large screens center it, Small screens hide it */}
      <div className="relative flex w-full hidden lg:block">
        <div className="animate-rotateVinyl absolute left-1/2 left-[100%] aspect-square w-[150vw] -translate-x-[100%] lg:left-[50%] lg:w-[70vw] lg:-translate-x-1/2 lg:-translate-y-[50%]">
          <Image src={vinyl} alt="Big Vinyl Center" className="h-full w-full" />
        </div>
      </div>

      <div className="relative flex w-full">
        <div className='absolute w-0 aspect-[1262/315] lg:w-[calc(100vw*1262/1440)] left-[calc(100vw*16/1440)] top-[calc(-1*100vw*720/1440)]'> 
            <Image src={sparkles} alt="Vinyl Sparkles" className="h-full w-full"/>
        </div>
      </div>

    </div>
  );
}
