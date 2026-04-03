import Image from 'next/image';
import mentorGraphic from '@public/hackers/starter-kit/resources/rabbit_duck_mentor.svg';
import IdeateSection from './IdeateSection';

export default function IdeateMentorCallout() {
  return (
    <IdeateSection eyebrow="Still Feel Stuck?" title="Talk with a mentor">
      <div className="grid gap-5 rounded-[28px] bg-[linear-gradient(135deg,#d9f5f2_0%,#edf8bb_100%)] p-4 shadow-[0_16px_45px_rgba(175,209,87,0.14)] ring-1 ring-[#dcecad] md:grid-cols-[minmax(260px,0.95fr)_minmax(0,1.05fr)] md:items-center md:p-6 lg:p-8">
        <div className="relative order-2 mx-auto flex aspect-[1.4] w-full max-w-[360px] items-center justify-center overflow-hidden rounded-[24px] bg-[#d9f5f2] md:order-1">
          <div className="absolute right-10 top-8 h-28 w-28 rounded-full border-2 border-[#8ccfdd]" />
          <Image
            src={mentorGraphic}
            alt="HackDavis mentor illustration"
            className="relative h-full w-full object-contain p-4"
          />
        </div>
        <div className="order-1 flex flex-col gap-4 md:order-2">
          <p className="text-sm leading-7 text-[#5e6457] md:text-base">
            No worries, we have a panel of industry mentors who are ready to
            lend you help at any part of your development process.
          </p>
          <p className="text-sm leading-7 text-[#5e6457] md:text-base">
            Have a question regarding hackathon events, project direction, or
            technical blockers? Reach out and we&apos;ll get you connected.
          </p>
          <div>
            <a
              href="https://discord.gg/Ba5xAtf8"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-full bg-[#f4f8ce] px-5 py-3 font-metropolis text-sm font-semibold tracking-[0.02em] text-text-dark ring-1 ring-[#d7df9c] transition hover:-translate-y-0.5 hover:bg-[#eef4b5] md:text-base"
            >
              Contact a mentor
            </a>
          </div>
        </div>
      </div>
    </IdeateSection>
  );
}
