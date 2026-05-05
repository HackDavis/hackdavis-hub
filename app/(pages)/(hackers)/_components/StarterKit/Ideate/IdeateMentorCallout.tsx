import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import type { StaticImageData } from 'next/image';
import type { ReactNode } from 'react';
import mentorGraphic from '@public/hackers/starter-kit/ideate/TalkMentor.svg';
import IdeateSection from './IdeateSection';

interface MentorCalloutCardProps {
  imageSrc: StaticImageData;
  imageAlt: string;
  eyebrow: string;
  description: ReactNode;
  note?: ReactNode;
  noteBgClassName?: string;
  ctaHref: string;
  ctaLabel: string;
}

export function MentorCalloutCard({
  imageSrc,
  imageAlt,
  eyebrow,
  description,
  note,
  noteBgClassName,
  ctaHref,
  ctaLabel,
}: MentorCalloutCardProps) {
  return (
    <IdeateSection eyebrow=" " title="">
      <div className="grid items-start gap-8 md:grid-cols-[minmax(320px,0.95fr)_minmax(0,1fr)] md:gap-10 lg:gap-14">
        <div className="relative order-1 mx-auto flex w-full max-w-[44rem] items-center justify-center overflow-hidden rounded-[28px] md:order-1 md:mx-0">
          <Image
            src={imageSrc}
            alt={imageAlt}
            className="w-full h-auto object-contain"
          />
        </div>
        <div className="order-2 flex flex-col gap-6 md:order-2">
          <p className="text-[1rem] font-dm-mono uppercase text-[#00000066]">
            {eyebrow}
          </p>
          <p className="max-w-[38rem] text-[#656565] text-[1rem]">
            {description}
          </p>
          {note ? (
            <div
              className={`hidden rounded-[20px] px-6 py-5 text-[#000000a6] md:block md:px-8 md:py-6 ${
                noteBgClassName || 'bg-[#E9FBBA]'
              }`}
            >
              <p className="text-[1rem]">{note}</p>
            </div>
          ) : null}
          <div className="pt-1">
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 font-dm-mono text-[1.125rem] uppercase text-[#3F3F3F] underline underline-offset-4 transition hover:opacity-75"
            >
              <ArrowRight className="h-5 w-5" />
              {ctaLabel}
            </a>
          </div>
        </div>
      </div>
    </IdeateSection>
  );
}

export default function IdeateMentorCallout() {
  return (
    <MentorCalloutCard
      imageSrc={mentorGraphic}
      imageAlt="HackDavis mentor illustration"
      eyebrow="Still Feel Stuck?"
      description="No worries, we have a panel of industry mentors who are ready to lend you help at any part of your development process."
      note={
        <>
          <span className="italic">Note:</span> If you have any questions
          regarding hackathon events, please contact a{' '}
          <a
            href="https://discord.gg/Ba5xAtf8"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4"
          >
            director
          </a>
          .
        </>
      }
      ctaHref="https://discord.gg/wc6QQEc"
      ctaLabel="Contact a mentor"
    />
  );
}
