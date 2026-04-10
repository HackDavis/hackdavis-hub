import Image from 'next/image';

import on_fire_image from '@public/hackers/starter-kit/moreTips/on_fire.svg';
import pitch_image from '@public/hackers/starter-kit/moreTips/pitch.svg';
import relaxing_image from '@public/hackers/starter-kit/moreTips/relaxing.svg';

const tips = [
  {
    title: 'Your pitch is more important than you think',
    description:
      'These 5 minutes determine how much your work in the last 24 hours are worth!',
    image: pitch_image,
    imageAlt: 'Frog mascot pitching to judges',
  },
  {
    title: 'Don’t be scared to pivot',
    description:
      'When building, new ideas may come. Make sure ot not be afraid to take the risk of going off track.',
    image: on_fire_image,
    imageAlt: 'Frog mascot on fire, working on computer',
  },
  {
    title: 'Learn something new!',
    description:
      'The most rewarding hackathons aren’t the ones you win, its the ones you challenge what you know!',
    image: relaxing_image,
    imageAlt: 'Mascot bunny sitting playing guitar',
  },
];

export default function MoreTips() {
  return (
    <div className="w-full px-[4%] py-[7%] flex flex-col gap-[80px]">
      <div>
        <p className="text-[1rem] uppercase text-[#00000066] font-normal font-dm-mono mb-[12px]">
          NOW YOU’RE FULLY EQUIPPED WITH KNOWLEDGE
        </p>
        <h2 className="text-[1.75rem] md:text-[2rem] font-semibold text-[#3F3F3F] leading-normal">
          Hacker, onwards! Submit your final project on <u>Devpost</u> by{' '}
          <i>May 10th 11:00 AM</i>.
        </h2>
      </div>

      <div>
        <p className="text-[1rem] uppercase text-[#00000066] font-normal font-dm-mono mb-[12px]">
          LAST MINUTE TIPS
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[40px] md:gap-[60px]">
          {tips.map((tip) => (
            <article key={tip.title}>
              <div className="mb-5 overflow-hidden">
                <Image
                  src={tip.image}
                  alt={tip.imageAlt}
                  className="h-auto w-full"
                  priority={false}
                />
              </div>

              <h3 className="mb-2 text-[1.25rem] font-medium text-[#1F1F1F]">
                {tip.title}
              </h3>

              <p className="text-[1rem] text-[#000000a6]">{tip.description}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
