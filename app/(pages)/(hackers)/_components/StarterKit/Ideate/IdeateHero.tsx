import Image from 'next/image';
import podium from '@public/hackers/starter-kit/ideate/WinnableIdea.svg';
import IdeateSection from './IdeateSection';

export default function IdeateHero() {
  return (
    <IdeateSection eyebrow="Ideate" title="What is a winnable idea?">
      <div className="grid items-start gap-8 md:grid-cols-[minmax(0,1fr)_minmax(320px,0.95fr)] md:gap-12 lg:gap-16">
        <div className="max-w-[34rem] pt-[5%] self-start space-y-6 text-[0.95rem] leading-[1.3] text-[#5e6457] md:text-[1rem] lg:text-[1.05rem]">
          <p>
            A winnable idea is{' '}
            <span className="underline decoration-[#a7ae85] decoration-[1.5px] underline-offset-[0.18em]">
              not
            </span>{' '}
            always the most complicated one. It is clear, purposeful, and rooted
            in a real user need.
          </p>
          <p>
            When your team combines impact, audience awareness, and a unique
            angle, your project is much more likely to stand out to judges.
          </p>
        </div>
        <div className="relative mx-auto flex aspect-[1.48] w-full max-w-[33rem] items-end justify-center overflow-hidden rounded-[26px] bg-[#D5FDFF] md:self-end md:justify-self-end">
          <Image
            src={podium}
            alt="HackDavis animals celebrating on a podium"
            className="relative z-10 h-auto w-full self-end object-contain px-3 pt-3 md:px-5 md:pt-5"
            priority
          />
        </div>
      </div>
    </IdeateSection>
  );
}
