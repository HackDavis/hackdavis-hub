'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import grassAsset from '@public/hackers/mvp/grass_asset.svg';
import mascots from '@public/hackers/mvp/peeking_around_wall.svg';
import VocalAngelCow from 'public/hackers/mvp/vocal_angel_cow.svg';
import login_mascots_mobile from '@public/hackers/login/login_mascots_mobile.svg';

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

  useEffect(() => {
    if (pathname === '/register/details') {
      setMascotsVisibility(false);
    } else {
      setMascotsVisibility(true);
    }
  }, [pathname]);

  return (
    <div className="flex flex-row w-full h-screen">
      <div className="flex flex-1 flex-col justify-center flex-start">
        <div className="flex flex-col items-center text-left">
          <Image src={VocalAngelCow} alt="Angel Cow" height={100} width={100} />
          <h1 className="text-[22px] font-semibold">{title}</h1>
          <p className="text-[16px]" style={{ whiteSpace: 'pre-line' }}>
            {subtitle}
          </p>
        </div>

        <div>{children}</div>
      </div>
      <div className="flex flex-1 flex-col justify-end bg-[linear-gradient(284deg,rgba(213,252,209,0.60)_9.72%,rgba(178,231,221,0.60)_44.61%,rgba(118,214,230,0.60)_79.5%)]">
        {mascotsVisibility && (
          <Image
            src={mascots}
            alt="mascots peeping"
            style={{ position: 'absolute' }}
          />
        )}
        <Image
          src={grassAsset}
          alt="grass asset"
          style={mascotsVisibility ? {} : { position: 'relative' }}
        />
      </div>
    </div>
  );
}
