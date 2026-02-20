'use client';

import Image from 'next/image';
// import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-[var(--footer-color)]">
      {/* outer padding to match the big empty space */}
      <div className="mx-auto w-full px-[6%] py-16">
        <div className="mb-10">
          <div className="mx-auto h-[1px] w-[100%] bg-white" />
        </div>

        {/* logo row */}
        <div className="flex items-center gap-2">
          {/* swap this src to whatever your mark is */}
          <div className="relative w-[200px] h-auto pb-5">
            <Image
              src="/Footer/FooterLogo.svg"
              alt="Footer Logo"
              width={500}
              height={200}
              className="w-[240px] h-auto"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
