import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';

import arrowRight from '@public/icons/arrow-right.svg';
import hackersChoiceAsset from '@public/waiting-hero/hackers-choice-asset.svg';
import judgingAsset from '@public/waiting-hero/judging-asset.svg';
import pitchAsset from '@public/waiting-hero/pitch-asset.svg';

type WaitingCardProps = {
  imageSrc: StaticImageData | string;
  imageAlt: string;
  title: string;
  description: string;
  linkLabel?: string;
  href?: string;
};

function WaitingCard({
  imageSrc,
  imageAlt,
  title,
  description,
  linkLabel,
  href,
}: WaitingCardProps) {
  return (
    <article className="overflow-hidden rounded-[16px] bg-white">
      <div className="relative w-full aspect-[16/9]">
        <Image src={imageSrc} alt={imageAlt} fill className="object-cover" />
      </div>
      <div className="flex min-h-[190px] flex-col p-5">
        <h3 className="font-jakarta text-[2rem] font-bold leading-[100%] tracking-[0.8px] text-[#3F3F3F] sm:text-[2.125rem] md:text-[1.75rem] lg:text-[1.75rem]">
          {title}
        </h3>
        <p className="mt-[1vw] mb-[2vw] font-jakarta text-[0.9rem] leading-[145%] tracking-[0.32px] text-[#5E5E65]">
          {description}
        </p>
        {linkLabel && href ? (
          <Link
            href={href}
            className="mt-auto mb-[1vw] inline-flex items-center gap-2 pt-7 font-dm-mono text-[1.1rem] leading-[100%] tracking-[0.4px] text-[#3F3F3F] underline decoration-[1px] underline-offset-4"
          >
            <Image
              src={arrowRight}
              alt=""
              aria-hidden="true"
              className="h-4 w-4"
            />
            {linkLabel}
          </Link>
        ) : null}
      </div>
    </article>
  );
}

const waitingCards: WaitingCardProps[] = [
  {
    imageSrc: pitchAsset,
    imageAlt: 'Practice your pitch',
    title: 'Practice your pitch',
    description:
      'Make sure you’re ready to pitch your product blhab dksjhf akjdhfsd dskjgh fdlgkfdhgkjfd fkjdhgfkj fkdlghdfk. ',
  },
  {
    imageSrc: hackersChoiceAsset,
    imageAlt: 'Submit your vote',
    title: 'Submit your vote',
    description:
      'Get our announcements updates in our discord and instagram blah blah blah blah blah.',
    linkLabel: 'HACKERS CHOICE AWARD',
    href: '#',
  },
  {
    imageSrc: judgingAsset,
    imageAlt: 'Learn about judging',
    title: 'Learn about Judging',
    description:
      'Get our announcements updates in our discord and instagram blah blah blah blah blah.',
    linkLabel: 'LEARN OUR JUDGING PROCESS',
    href: '#',
  },
];

export default function HeroWaiting() {
  return (
    <section className="min-h-screen w-full p-4 md:p-10">
      <div className="mx-auto min-h-[calc(100vh-2rem)] w-[90vw] max-w-[1440px] rounded-[32px] bg-[#FAFAFF] px-6 pt-12 pb-16 md:min-h-[calc(100vh-5rem)] md:px-10 md:pt-16 md:pb-24">
        <div className="mx-auto flex w-[92%] max-w-[1120px] flex-col pt-8 pb-16 font-jakarta text-[#3F3F3F] md:pt-12 md:pb-24">
          <h2 className="text-[1rem] leading-[100%] tracking-[0.88px] sm:text-[3.5rem] md:text-[2.5rem] lg:text-[2.5rem]">
            While you wait at{' '}
            <span className="underline decoration-[1.25px]">Table 17</span>...
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {waitingCards.map((card) => (
              <WaitingCard key={card.title} {...card} />
            ))}
          </div>

          <p className="mt-10 font-jakarta text-[1.75rem] font-bold leading-[100%] tracking-[0.56px] text-[#5E5E65] sm:text-[2rem] md:text-[1.25rem]">
            Give us a moment while we assign your team judges.
          </p>
        </div>
      </div>
    </section>
  );
}

/*
For this file:
- Table Number Hook: app/(pages)/(hackers)/_components/TableNumberCheckin/TableNumberCheckin.tsx
- Hackers Choice Award: app/(pages)/(hackers)/_components/HomeJudging/HackersChoiceAwards.tsx
- Learn about our judging process: /project-info

For second ticket, most editing will be here:
- app/(pages)/_components/AuthForm/JudgeAuthForm.module.scss
*/
