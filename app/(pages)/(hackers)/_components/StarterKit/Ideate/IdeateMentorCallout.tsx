import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import mentorGraphic from '@public/hackers/starter-kit/ideate/TalkMentor.svg';
import IdeateSection from './IdeateSection';

export default function IdeateMentorCallout() {
  return (
    <IdeateSection eyebrow=" " title="">
      <div className="grid items-start gap-8 md:grid-cols-[minmax(320px,0.95fr)_minmax(0,1fr)] md:gap-10 lg:gap-14">
        <div className="relative order-1 mx-auto flex aspect-[1.72] w-full max-w-[44rem] items-center justify-center overflow-hidden rounded-[28px] bg-[#E4FFFE] md:order-1 md:mx-0">
          <Image
            src={mentorGraphic}
            alt="HackDavis mentor illustration"
            className="relative h-full w-full object-contain"
          />
        </div>
        <div className="order-2 flex flex-col gap-6 md:order-2">
          <p className="text-[0.6rem] font-jakarta uppercase tracking-[0.2em] text-text-gray md:text-xs">
            Still Feel Stuck?
          </p>
          <p className="max-w-[38rem] text-[0.92rem] leading-[1.35] text-[#5e6457] md:text-[1rem] lg:text-[1.08rem]">
            No worries, we have a panel of industry mentors who are ready to
            lend you help at any part of your development process.
          </p>
          <div className="hidden rounded-[24px] bg-[#eef8bf] px-6 py-5 text-[#5e6457] md:block md:px-8 md:py-6">
            <p className="text-[1rem] leading-[1.3] md:text-[1.18rem]">
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
            </p>
          </div>
          <div className="pt-1">
            <a
              href="https://discord.gg/Ba5xAtf8"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 font-dm-mono text-[1.05rem] uppercase tracking-[0.12em] text-text-dark underline underline-offset-4 transition hover:opacity-75 md:text-[1.18rem]"
            >
              <ArrowRight className="h-5 w-5" />
              Contact a mentor
            </a>
          </div>
        </div>
      </div>
    </IdeateSection>
  );
}
