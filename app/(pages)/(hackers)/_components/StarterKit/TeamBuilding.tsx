import Image from 'next/image';
import type Event from '@typeDefs/event';
import teamMixer from '@public/hackers/starter-kit/teamBuilding/teamMixer.svg';
import mascots from '@public/hackers/starter-kit/teamBuilding/mascotSquad.svg';
import { CalendarItem } from '@pages/(hackers)/_components/Schedule/CalendarItem';
import { MentorCalloutCard } from '@pages/(hackers)/_components/StarterKit/Ideate/IdeateMentorCallout';

// TODO: Update with actual Team Mixer details
const TEAM_MIXER_EVENT: Event = {
  name: 'Team Mixer',
  type: 'ACTIVITIES',
  location: 'ARC Ballroom A',
  start_time: new Date('2026-05-09T08:30:00'),
  end_time: new Date('2026-05-09T09:30:00'),
};

export default function TeamBuilding() {
  return (
    <section className="flex flex-col py-[7%] px-[4%] bg-[#FAFAFF] gap-[112px] md:gap-[144px]">
      {/* Header */}
      <div>
        <div className="flex flex-col gap-2">
          <p className="text-[1rem] uppercase text-[#00000066] font-normal font-dm-mono">
            Team Building
          </p>

          <h2 className="text-[1.75rem] md:text-[2rem] font-semibold text-[#1F1F1F] leading-normal">
            Find your squad.
          </h2>

          <p className="text-[1rem] text-[#000000a6] font-normal">
            Building with friends (new or old) is what makes hackathons
            memorable. Looking for a crew? Join us for our in-person Mixer to
            meet potential teammates and brainstorm ideas.
          </p>
        </div>

        {/* Event Card */}
        <div className="mt-[40px] md:mt-[60px]">
          <CalendarItem
            event={TEAM_MIXER_EVENT}
            attendeeCount={15}
            hideAddButton
          />
        </div>
      </div>

      {/* Illustration + Discord CTA */}
      <MentorCalloutCard
        imageSrc={teamMixer}
        imageAlt="Team building illustration"
        eyebrow="Missed the event?"
        description={
          <>
            No worries! Jump into our Discord and head to the{' '}
            <span className="text-base font-medium text-[#3a3a3a]">
              #team-formation
            </span>{' '}
            channel. Introduce yourself, share your skills, and see who&apos;s
            looking for a teammate.
          </>
        }
        note={
          <>
            <span className="italic">Pro-tip</span>: You can switch teams
            anytime before the final submission deadline.
          </>
        }
        noteBgClassName="bg-[#F3F3FC]"
        ctaHref="https://discord.gg/wc6QQEc"
        ctaLabel="Go to Discord"
      />

      {/* Guiding Questions */}
      <div className="flex flex-col gap-[40px] md:gap-[60px]">
        <div className="flex flex-col gap-3">
          <p className="text-[1rem] uppercase text-[#00000066] font-normal font-dm-mono">
            Guiding questions to find the right team
          </p>

          <h2 className="text-[1.25rem] font-semibold text-[#3a3a3a]">
            Ask yourself questions like…
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {[
            { n: '01.', q: 'Is this person passionate about the same tracks?' },
            { n: '02.', q: "Does this person's skills complement mine?" },
            { n: '03.', q: 'Can I see myself working with them for 24 hours?' },
          ].map(({ n, q }) => (
            <div
              key={n}
              className="flex flex-col gap-3 border-l-2 border-[#E1E1E5] pl-3"
            >
              <span className="text-[1rem] text-[#000000a6] font-dm-mono">
                {n}
              </span>

              <p className="text-[1rem] text-[#000000a6] font-dm-mono">{q}</p>
            </div>
          ))}
        </div>

        {/* Mascot banner */}
        <div className="relative w-full h-[300px] overflow-hidden rounded-[30px]">
          <Image
            src={mascots}
            alt="HackDavis mascots"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
