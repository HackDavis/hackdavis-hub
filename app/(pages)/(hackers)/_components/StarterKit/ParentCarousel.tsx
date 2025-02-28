'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import good_froggie from '@public/hackers/good_froggie.svg';
import judge_bunny from '@public/hackers/judge_bunny.svg';
import { type CarouselApi } from '@globals/components/ui/carousel';
import { Button } from '@globals/components/ui/button';

import LetsBegin from '../../_components/StarterKitStages/LetsBegin';
import FindATeam from '../../_components/StarterKitStages/FindATeam';
import Ideate from '../../_components/StarterKitStages/Ideate';
import Resources from '../../_components/StarterKitStages/Resources';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@globals/components/ui/carousel';
import { Card, CardContent } from '@globals/components/ui/card';

const carouselHeader = [
  {
    title: "Let's Begin!",
    color: '#005271',
    component: <LetsBegin />,
    slides: [
      {
        title: 'Hacking 101 Workshop',
        subtitle: 'JOIN US FOR OUR',
      },
      {
        title: 'In case you missed it...',
        subtitle: "HERE's A RECAP OF THE WORKSHOP",
      },
    ],
  },
  {
    title: 'Find a Team',
    color: '#AFD157',
    component: <FindATeam />,
    slides: [
      {
        title: 'In case you missed it...',
        subtitle: "HERE's A RECAP OF THE WORKSHOP",
      },
    ],
  },
  {
    title: 'Ideate',
    color: '#FFC53D',
    component: <Ideate />,
    slides: [
      {
        title: 'Hacking 101 Workshop',
        subtitle: 'JOIN US FOR OUR',
      },
    ],
  },
  {
    title: 'Resources',
    color: '#005271',
    component: <Resources />,
    slides: [
      {
        title: 'Hacking 101 Workshop',
        subtitle: 'JOIN US FOR OUR',
      },
      {
        title: 'In case you missed it...',
        subtitle: "HERE's A RECAP OF THE WORKSHOP",
      },
    ],
  },
];

function Star({
  fillColor,
  className,
}: {
  fillColor: string;
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.3607 0.928762C11.733 -0.0772852 13.1559 -0.0772852 13.5282 0.928762L16.1614 8.04481C16.2784 8.36111 16.5278 8.61049 16.8441 8.72753L23.9601 11.3607C24.9662 11.733 24.9662 13.1559 23.9601 13.5282L16.8441 16.1614C16.5278 16.2784 16.2784 16.5278 16.1614 16.8441L13.5282 23.9601C13.1559 24.9662 11.733 24.9662 11.3607 23.9601L8.72753 16.8441C8.61049 16.5278 8.36111 16.2784 8.04481 16.1614L0.928762 13.5282C-0.0772852 13.1559 -0.0772852 11.733 0.928762 11.3607L8.04481 8.72753C8.36111 8.61049 8.61049 8.36111 8.72753 8.04481L11.3607 0.928762Z"
        fill={fillColor}
      />
    </svg>
  );
}

function Header({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="relative flex items-center justify-between px-0 xl:pr-4 -mb-12 lg:-mb-[4.5rem] z-50 ">
      <Image
        src={judge_bunny}
        alt="judge_bunny"
        className="absolute z-10 -right-2 xs:-right-3 bottom-9 w-[80px] xs:w-auto h-[100px] xs:h-[125px] lg:h-[200px] xl:h-[200px] xs:aspect-[calc(184/204)] [transform:rotateY(180deg)] md:transform-none md:relative md:-right-0 md:bottom-0"
      />
      <div className="flex flex-col md:flex-row gap-2 xl:gap-4 w-full pb-16 md:pb-12 lg:pb-16">
        <div className="flex flex-row items-end gap-4 md:gap-2 md:items-center">
          <div className="flex flex-col items-start justify-around md:h-[50px] xl:h-[65px]">
            <p className="font-jakarta text-[0.5rem] xs:text-xs lg:text-sm xl:text-base font-normal leading-normal md:leading-[15px] lg:leading-[20px] text-background-secondary flex-none order-0 self-stretch">
              SAY HI TO YOUR
            </p>
            <h3 className="font-metropolis text-lg xs:text-2xl md:text-xl lg:text-2xl xl:text-4xl font-bold leading-5 md:leading-[30px] lg:leading-[40px] tracking-[0.02em] text-background-primary-dark flex-none order-1">
              Starter Kit
            </h3>
          </div>
          <Star
            fillColor="#005271"
            className="aspect-square mb-[3px] xs:mb-[6px] md:mb-0 w-[15px] xs:w-[20px] md:w-[15px] lg:w-[25px]"
          />
        </div>

        <div className="flex flex-col justify-center gap-[2px] lg:gap-[5px]">
          <p className="text-[0.5rem] xs:text-[0.625rem] md:text-[0.75rem] lg:text-sm xl:text-base whitespace-pre-wrap text-nowrap">
            A HACKDAVIS HUB{'\n'}
            FOR EVERYONE WHO
            <span className="font-mono text-[0.5rem] xs:text-xs lg:text-sm xl:text-lg md:tracking-[0.24px] lg:tracking-[0.36px]">{` // creates for social good`}</span>
          </p>
        </div>
      </div>
      <div className="flex flex-col -mb-20 xs:-mb-28 md:-mb-0 mr-5 2xs:mr-0 md:gap-7 md:justify-between md:aspect-[calc(256/212)] md:h-[120px] lg:h-[200px] xl:h-[200px]">
        <Image
          src={good_froggie}
          alt="good_froggie"
          className="hidden md:block h-full pr-2 self-end"
        />
        <CarouselIndicators activeIndex={activeIndex} />
      </div>
    </div>
  );
}

function CarouselButtons({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="flex flex-col gap-2 md:flex-row-reverse px-6 md:px-12 lg:px-16 xl:px-24 md:justify-between">
      {activeIndex === 3 ? (
        <a href="/">
          <Button
            variant="default"
            className="flex flex-row justify-center items-center w-full md:w-[150px] h-fit p-2 bg-background-secondary border-2 border-solid border-background-secondary rounded-[100px] font-jakarta text-xs xs:text-base md:text-lg leading-3 tracking-[0.18px] text-white hover:bg-background-primary"
          >
            Home
          </Button>
        </a>
      ) : (
        <CarouselNext className="static w-full" />
      )}
      <div className="hidden md:block">
        <CarouselIndicators activeIndex={activeIndex} elongateActive />
      </div>
      {activeIndex === 0 ? (
        <a href="/">
          <Button
            variant="outline"
            className="flex justify-center items-center w-full md:w-[150px] h-fit p-2 border-2 border-solid border-background-secondary rounded-[100px] bg-transparent shadow-none font-jakarta text-xs xs:text-base md:text-lg leading-3 tracking-[0.18px] text-background-secondary hover:bg-background-secondary hover:text-white"
          >
            Home
          </Button>
        </a>
      ) : (
        <CarouselPrevious className="static w-full" />
      )}
    </div>
  );
}

function CarouselIndicators({
  activeIndex,
  elongateActive,
}: {
  activeIndex: number;
  elongateActive?: boolean;
}) {
  return (
    <div
      className={`flex gap-1 md:gap-2 2xs:pr-6 ${
        elongateActive ? 'md:pr-0' : 'md:pr-12 lg:pr-16 xl:pr-20'
      } self-end`}
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          style={{
            backgroundColor: activeIndex === index ? '#9EE7E5' : '#005271',
            aspectRatio: activeIndex === index && elongateActive ? '3' : '1',
            transition: 'all 0.3s ease',
          }}
          className="h-2 xs:h-3 lg:h-4 rounded-full border border-background-secondary"
        />
      ))}
    </div>
  );
}

export function ParentCarousel() {
  // TODO: resume wherever user left off
  const [activeIndex, setActiveIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) {
      return;
    }

    api.on('select', () => {
      setActiveIndex(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <main
      className="w-full flex-col items-center justify-center p-8 pt-24 xs:pt-28 xl:p-16 overflow-hidden"
      style={{
        background:
          'linear-gradient(136.61deg, #97DBEF 12.93%, #79CCD9 48.22%, #FFEDCF 83.5%)',
        position: 'relative',
      }}
    >
      <Header activeIndex={activeIndex} />
      <Carousel
        className="relative flex flex-col z-0 bg-white/45 backdrop-blur border-none rounded-xl pb-6 md:pb-12 lg:pb-16 xl:pb-24 overflow-x-clip"
        setApi={setApi}
      >
        <div className="relative flex items-center gap-2 md:mt-10 lg:mt-14">
          <div className="invisible p-4 pl-8 md:p-6 md:pl-12 lg:pl-16 xl:p-8 xl:pl-24 flex items-center justify-center md:justify-between md:gap-4">
            {' '}
            <p className="text-white text-lg xs:text-xl md:text-3xl xl:text-4xl font-bold text-nowrap">
              .
            </p>
          </div>
          {carouselHeader.map((item, index) => (
            <div
              key={index}
              className="absolute top-0 left-0 rounded-r-[12px] p-4 pl-8 md:p-6 md:pl-12 lg:pl-16 xl:p-8 xl:pl-24 flex items-center justify-center md:justify-between md:gap-4 transition-transform duration-300 ease-in-out"
              style={{
                backgroundColor: item.color,
                transform: `translateX(${
                  activeIndex === index ? '0' : '-100%'
                })`,
              }}
            >
              <Star
                fillColor="#fff"
                className="hidden md:block w-[20px] h-[20px]"
              />
              <p className="text-white text-lg xs:text-xl md:text-3xl xl:text-4xl font-bold text-nowrap">
                {item.title}
              </p>
            </div>
          ))}
        </div>
        <CarouselContent>
          {carouselHeader.map((item, index) => (
            <CarouselItem key={index}>
              <Card className="bg-transparent border-none shadow-none">
                <div className="p-6 md:p-12 lg:p-16 xl:p-24">
                  <CardContent className="p-0"> {item.component} </CardContent>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselButtons activeIndex={activeIndex} />
      </Carousel>
    </main>
  );
}
