import React from 'react';
import Image from 'next/image';
import { Plus_Jakarta_Sans, DM_Mono } from 'next/font/google';

// Fonts
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['500'],
});

export interface CardProps {
  image: string;
  title: string;
  description: string;
  link?: string;
  linkName: string;
}

// Mentor and Director Card Component
export const Card: React.FC<CardProps> = ({
  image,
  title,
  description,
  link = '#',
  linkName,
}) => {
  return (
    <div className="flex flex-col w-full rounded-2xl">
      {/* Image */}
      <div className="relative w-full">
        <Image
          src={image}
          alt={image}
          width={1}
          height={1}
          className="w-full h-auto m-0 rounded-t-2xl"
        />
      </div>

      {/* Card Descriptions */}
      <div className="h-full rounded-b-2xl flex flex-col px-6 pt-4 md:pt-[30px] pb-8 bg-[#FFFFFF] ">
        {/* Card Title */}
        <h2
          className={`${plusJakarta.className} font-semibold text-[#3F3F3F] text-[22px] md:text-[32px] mb-4 md:mb-7 leading-normal tracking-[0.44px]`}
        >
          {title}
        </h2>

        {/* Card Description */}
        <p
          className={`${plusJakarta.className} font-normal text-[#606269] text-4 mb-8 md:mb-16`}
        >
          {description}
        </p>

        {/* Card Links */}
        <div className="flex items-end mt-auto">
          <Image
            src="/components/MDHelp/arrow.svg"
            alt={image}
            width={1}
            height={1}
            className="w-6 h-auto m-0"
          />

          <a
            href={link}
            className={`${dmMono.className} leading-none m-0.5 text-[#3F3F3F] font-medium border-b border-[#3F3F3F]`}
            target="_blank"
          >
            {linkName}
          </a>
        </div>
      </div>
    </div>
  );
};
