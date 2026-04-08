import Image from 'next/image';
import type { StaticImageData } from 'next/image';

import arrow from '@public/hackers/starter-kit/designResources/arrow_icon.svg';

interface Link {
  type: string;
  title: string;
  description: string;
  image: StaticImageData;
  buttonName: string;
  link: string;
  alt: string;
}

function Link({ link }: { link: Link }) {
  return (
    <div className="flex flex-col md:flex-row bg-white rounded-[16px] gap-[32px] px-[18px] py-[32px]">
      <Image src={link.image} alt={link.alt} className="w-full md:w-auto" />
      <div className="flex flex-col gap-[8px]">
        <p className="opacity-[0.40] text-[16px] font-mono">{link.type}</p>
        <p className="text-[20px] text-[#1F1F1F] font-semibold">{link.title}</p>
        <p className="opacity-[0.65] text-[16px]">{link.description}</p>
        <button
          className="flex flex-row gap-[4px] items-center bg-[#3F3F3F] rounded-full px-[24px] py-[12px] mt-[8px] text-[#FAFAFF] text-[14px] w-min text-nowrap"
          onClick={() => window.open(link.link, '_blank')}
        >
          {link.buttonName}
          <Image
            src={arrow}
            alt="arrow"
            className="w-[20px] h-[20px] shrink-0"
          />
        </button>
      </div>
    </div>
  );
}

export function Resources({
  title,
  link1,
  link2,
}: {
  title: string;
  link1: Link;
  link2: Link;
}) {
  return (
    <div className="flex flex-col gap-[16px]">
      <p className="text-[20px] text-[#1F1F1F] font-semibold pb-[16px]">
        {title}
      </p>
      <Link link={link1} />
      <Link link={link2} />
    </div>
  );
}
