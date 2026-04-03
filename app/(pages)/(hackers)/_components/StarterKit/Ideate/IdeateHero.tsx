import Image from 'next/image';
import podium from '@public/hackers/starter-kit/ideate/podium.svg';
import IdeateSection from './IdeateSection';

export default function IdeateHero() {
  return (
    <IdeateSection eyebrow="Ideate" title="What is a winnable idea?">
      <div className="grid gap-6 rounded-[28px] bg-[linear-gradient(135deg,rgba(255,255,255,0.62)_0%,rgba(245,255,208,0.7)_100%)] p-4 shadow-[0_16px_45px_rgba(175,209,87,0.12)] ring-1 ring-[#e7efb6] md:grid-cols-[minmax(0,1.1fr)_minmax(260px,0.9fr)] md:items-center md:p-6 lg:p-8">
        <div className="space-y-4 text-sm leading-7 text-[#5e6457] md:text-base">
          <p>
            A winnable idea is not always the most complicated one. It is clear,
            purposeful, and rooted in a real user need.
          </p>
          <p>
            When your team combines impact, audience awareness, and a unique
            angle, your project is much more likely to stand out to judges.
          </p>
        </div>
        <div className="relative mx-auto flex aspect-[1.25] w-full max-w-[360px] items-center justify-center overflow-hidden rounded-[26px] bg-[linear-gradient(180deg,#d4f5f7_0%,#d4f4de_100%)] p-4">
          <div className="absolute inset-x-[10%] bottom-[10%] h-[18%] rounded-full bg-[#b9e48e]/50 blur-2xl" />
          <Image
            src={podium}
            alt="HackDavis animals celebrating on a podium"
            className="relative h-full w-full object-contain"
            priority
          />
        </div>
      </div>
    </IdeateSection>
  );
}
