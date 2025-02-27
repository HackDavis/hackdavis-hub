'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import good_froggie from '@public/hackers/good_froggie.svg';
import judge_bunny from '@public/hackers/judge_bunny.svg';
import star from '@public/hackers/star.svg';
import { type CarouselApi } from '@globals/components/ui/carousel';
import { Button } from '@app/(pages)/_globals/components/ui/button';

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

function Header({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="relative flex items-center justify-between px-0 xl:pr-4 -mb-12 lg:-mb-14 z-50 ">
      <Image
        src={judge_bunny}
        alt="judge_bunny"
        className="absolute z-10 -right-2 bottom-9 h-[100px] w-[80px] lg:h-[150px] xl:h-[200px] md:aspect-[calc(184/204)] [transform:rotateY(180deg)] md:transform-none md:relative md:-right-0 md:bottom-0"
      />
      <div className="flex flex-col md:flex-row gap-2 xl:gap-4 w-full pb-16 md:pb-12 lg:pb-16">
        <div className="flex flex-row items-end gap-4 md:gap-2">
          <div className="flex flex-col items-start justify-around md:h-[50px] xl:h-[65px]">
            <p className="font-jakarta text-[0.5rem] md:text-xs lg:text-sm xl:text-base font-normal leading-normal md:leading-[15px] lg:leading-[20px] text-[#005271] flex-none order-0 self-stretch">
              SAY HI TO YOUR
            </p>
            <h3 className=" font-metropolis text-[18px] leading-5 md:text-xl lg:text-2xl xl:text-4xl font-bold md:leading-[30px] lg:leading-[40px] tracking-[0.02em] text-[#123041] flex-none order-1">
              Starter Kit
            </h3>
          </div>
          <Image
            src={star}
            alt="star"
            className="aspect-square w-[15px] mb-[3px] md:w-[10px] lg:w-[25px]"
          />
        </div>

        <div className="flex flex-col justify-center gap-[2px] lg:gap-[5px]">
          <p className="text-[0.5rem] md:text-[0.75rem] lg:text-sm xl:text-base">
            A HACKDAVIS HUB
          </p>
          <p className="text-[0.5rem] md:text-[0.75rem] lg:text-sm xl:text-base whitespace-pre-wrap text-nowrap ">
            FOR EVERYONE WHO
            <span className="font-mono text-[0.5rem] md:text-xs lg:text-sm xl:text-lg md:tracking-[0.24px] lg:tracking-[0.36px]">{` // creates for social good`}</span>
          </p>
        </div>
      </div>
      <div className="flex flex-col md:items-center -mb-20 mr-5 md:justify-center md:aspect-[calc(256/212)] md:h-[100px] lg:h-[150px] xl:h-[200px]">
        <Image
          src={good_froggie}
          alt="good_froggie"
          className="hidden md:block h-full"
        />
        <CarouselIndicators activeIndex={activeIndex} />
      </div>
    </div>
  );
}

function CarouselButtons({ activeIndex }: { activeIndex: number }) {
  console.log('activeIndex', activeIndex);
  return (
    <div className="flex flex-col gap-2 md:flex-row-reverse">
      {activeIndex === 3 ? (
        <a href="/">
          <Button
            variant="default"
            className="flex flex-row justify-center items-center w-full h-fit p-2 bg-background-secondary border-2 border-solid border-background-secondary rounded-[100px] font-jakarta text-[9px] md:text-[18px] leading-3 tracking-[0.18px] text-white hover:bg-background-primary"
          >
            Home
          </Button>
        </a>
      ) : (
        <CarouselNext className="static w-full" />
      )}
      {activeIndex === 0 ? (
        <a href="/">
          <Button
            variant="outline"
            className="flex justify-center items-center w-full h-fit p-2 border-2 border-solid border-background-secondary rounded-[100px] bg-transparent shadow-none font-jakarta text-[9px] md:text-[18px] leading-3 tracking-[0.18px] text-background-secondary hover:bg-background-secondary hover:text-white"
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

function CarouselIndicators({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="flex gap-1 md:gap-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          style={{
            backgroundColor: activeIndex === index ? '#9EE7E5' : '#005271',
          }}
          className="w-2 h-2 lg:w-4 lg:h-4 rounded-full border border-[#005271]"
        />
      ))}
    </div>
  );
}

export function ParentCarousel({ children }: { children: React.ReactNode }) {
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
      className="w-full flex-col items-center justify-center p-8 pt-36 overflow-hidden"
      style={{
        background:
          'linear-gradient(136.61deg, #97DBEF 12.93%, #79CCD9 48.22%, #FFEDCF 83.5%)',
        position: 'relative',
      }}
    >
      <Header activeIndex={activeIndex} />
      <Carousel className="relative z-0" setApi={setApi}>
        <CarouselContent>
          {carouselHeader.map((item, index) => (
            <CarouselItem key={index}>
              <Card className="bg-white/45 backdrop-blur border-none">
                <div className="md:pt-16">
                  <div className="flex items-center gap-2">
                    <div
                      className="rounded-r-[12px] p-4 pl-8 md:pl-12 md:w-[330px] md:h-[103px] relative flex items-center justify-center"
                      style={{ backgroundColor: item.color }}
                    >
                      <Image
                        src={star}
                        alt="star"
                        className="hidden md:block w-7 h-7 "
                      />
                      <p className="text-white text-lg md:text-3xl font-bold text-nowrap">
                        {item.title}
                      </p>
                    </div>
                  </div>
                  <CardContent className="flex flex-col gap-8 p-5 pt-8">
                    {/* <span className="text-4xl font-semibold">{index + 1}</span> */}
                    {children}
                    <div className="md:hidden">
                      <CarouselButtons activeIndex={activeIndex} />
                    </div>
                  </CardContent>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:block">
          <CarouselButtons activeIndex={activeIndex} />
        </div>
      </Carousel>
    </main>
  );
}
