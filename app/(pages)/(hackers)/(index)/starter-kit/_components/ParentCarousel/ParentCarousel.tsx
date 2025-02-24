'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import good_froggie from '@public/hackers/good_froggie.svg';
import judge_bunny from '@public/hackers/judge_bunny.svg';
import { type CarouselApi } from '@globals/components/ui/carousel';

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
    title: "✦ Let's Begin!",
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
    title: '✦ Find a Team',
    color: '#AFD157',
    slides: [
      {
        title: 'In case you missed it...',
        subtitle: "HERE's A RECAP OF THE WORKSHOP",
      },
    ],
  },
  {
    title: '✦ Ideate',
    color: '#FFC53D',
    slides: [
      {
        title: 'Hacking 101 Workshop',
        subtitle: 'JOIN US FOR OUR',
      },
    ],
  },
  {
    title: '✦ Resources',
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
    <div className="relative flex gap-2 items-center justify-between px-4 -mb-20 z-50">
      <Image src={judge_bunny} alt="judge_bunny" width={200} height={200} />
      <div className="flex gap-4">
        <div className="flex flex-col items-start gap-[5px] w-[189px] h-[65px]">
          <p className="font-jakarta text-base font-normal leading-[20px] text-[#005271] flex-none order-0 self-stretch">
            SAY HI TO YOUR
          </p>
          <h3 className=" font-metropolis text-[36px] font-bold leading-[40px] tracking-[0.02em] text-[#123041] flex-none order-1">
            Starter Kit
          </h3>
        </div>
        <p>✦</p>
        <div className="flex flex-col">
          <p>A HACKDAVIS HUB</p>
          <div className="flex">
            <p>FOR EVERYONE WHO</p>
            <p>{`// creates for social good`}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-4">
        <Image src={good_froggie} alt="good_froggie" width={300} height={300} />
        <CarouselIndicators activeIndex={activeIndex} />
      </div>
    </div>
  );
}

function CarouselIndicators({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="flex gap-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          style={{
            width: '1rem',
            height: '1rem',
            borderRadius: '9999px',
            border: '1px solid #005271',
            backgroundColor: activeIndex === index ? '#9EE7E5' : '#005271',
          }}
        />
      ))}
    </div>
  );
}

export function ParentCarousel() {
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
      className="w-full flex-col items-center justify-center p-8"
      style={{
        background:
          'linear-gradient(136.61deg, #97DBEF 12.93%, #79CCD9 48.22%, #FFEDCF 83.5%)',
        position: 'relative',
        minHeight: '100vh',
      }}
    >
      <Header activeIndex={activeIndex} />
      <Carousel className="relative z-0" setApi={setApi}>
        <CarouselContent>
          {carouselHeader.map((item, index) => (
            <CarouselItem key={index}>
              <Card className="bg-white/45 backdrop-blur">
                <div className="pt-16">
                  <div className="flex items-center gap-2">
                    <div
                      className="rounded-r-[12px] p-4 pl-12 w-[330px] h-[103px] relative flex items-center justify-center"
                      style={{ backgroundColor: item.color }}
                    >
                      <p className="text-white text-3xl font-bold">
                        {item.title}
                      </p>
                    </div>
                  </div>
                  <CardContent className="flex aspect-square items-center justify-center p-6 bg-transparent backdrop-blur">
                    <span className="text-4xl font-semibold">{index + 1}</span>
                  </CardContent>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-between mt-4 px-4">
          <CarouselPrevious className="relative">
            <span className="absolute -bottom-6">Back</span>
          </CarouselPrevious>
          <CarouselNext className="relative">
            <span className="absolute -bottom-6">Next</span>
          </CarouselNext>
        </div>
      </Carousel>
    </main>
  );
}
