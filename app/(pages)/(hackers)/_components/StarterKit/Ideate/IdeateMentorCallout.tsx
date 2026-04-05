import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import mentorGraphic from '@public/hackers/starter-kit/ideate/TalkMentor.svg';
import IdeateSection from './IdeateSection';

export default function IdeateMentorCallout() {
  const mentorDiscordLink = 'https://discord.gg/wc6QQEc';
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
          <p className="text-[1rem] font-dm-mono uppercase text-[#00000066]">
            Still Feel Stuck?
          </p>
          <p className="max-w-[38rem] text-[#656565] text-[1rem]">
            No worries, we have a panel of industry mentors who are ready to
            lend you help at any part of your development process.
          </p>
          <div className="hidden rounded-[20px] bg-[#E9FBBA] px-6 py-5 text-[#000000a6] md:block md:px-8 md:py-6">
            <p className="text-[1rem]">
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
              href={mentorDiscordLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 font-dm-mono text-[1.125rem] uppercase text-[#3F3F3F] underline underline-offset-4 transition hover:opacity-75"
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
