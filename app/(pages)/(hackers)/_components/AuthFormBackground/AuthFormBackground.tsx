'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import grass_bottom from '@public/hackers/login/grass_bottom.svg';
import VocalAngelCow from 'public/hackers/mvp/vocal_angel_cow.svg';
import login_mascots_mobile from '@public/hackers/login/login_mascots_mobile.svg';
import mascots_with_notes from '@public/hackers/login/mascots_with_notes.svg';
import moving_clouds from '@public/hackers/login/moving_clouds.svg';

export default function AuthFormBackground({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  const [mascotsVisibility, setMascotsVisibility] = useState(true);
  const pathname = usePathname();

  // Hide mascots on register details page - mobile ONLY
  useEffect(() => {
    if (pathname === '/register/details') {
      setMascotsVisibility(false);
    } else {
      setMascotsVisibility(true);
    }
  }, [pathname]);

  return (
    <div className="flex flex-col md:flex-row w-full h-screen">
      <div className="flex flex-[1_0_auto] md:flex-1 flex-col justify-end md:justify-center items-center w-full  px-6 md:px-[82px]">
        <div className="flex flex-col items-start w-full">
          <Image
            src={VocalAngelCow}
            alt="Angel Cow"
            height={100}
            width={100}
            className="pb-[12px]"
          />
          <h1 className="text-[20px] md:text-[22px] font-semibold text-[#3F3F3F]">
            {title}
          </h1>
          <p
            className="text-[14px] md:text-[16px] text-[#5E5E65]"
            style={{ whiteSpace: 'pre-line' }}
          >
            {subtitle}
          </p>
        </div>

        <div className="w-full">{children}</div>
      </div>
      <div className="flex flex-1 flex-col justify-end relative md:overflow-hidden md:bg-[linear-gradient(284deg,rgba(213,252,209,0.60)_9.72%,rgba(178,231,221,0.60)_44.61%,rgba(118,214,230,0.60)_79.5%)]">
        {/* DESKTOP ONLY */}
        <div className="hidden md:block absolute top-0 left-0 w-[200%] z-[1] animate-moveClouds">
          <Image
            src={moving_clouds}
            alt="background clouds and music notes"
            width={2012}
            height={783}
            className="w-full"
          />
        </div>
        <Image
          src={grass_bottom}
          alt="grass asset"
          className="hidden md:block w-full relative z-[3]"
        />
        <Image
          src={mascots_with_notes}
          alt="mascots peeping"
          className="hidden md:block absolute right-0 bottom-0 z-[5]"
        />
        {/* MOBILE ONLY */}
        <Image
          src={login_mascots_mobile}
          alt="mobile mascots"
          className={`md:hidden w-full ${!mascotsVisibility ? 'hidden' : ''}`}
        />
      </div>
    </div>
  );
}
