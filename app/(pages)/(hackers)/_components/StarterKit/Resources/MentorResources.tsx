import Image from 'next/image';
import bunny_duck_mentor from '@public/starterKIt/rabbit_duck_mentor.svg';
export default function MentorResources() {
  return (
    <main className="relative p-12 pb-0 h-[300px] md:h-[400px] lg:h-[560px] flex flex-col justify-end items-center bg-[#005271] rounded-xl overflow-hidden">
      <div className="relative w-full h-full">
        <div className="relative w-full h-full flex items-end justify-end">
          <Image
            src={bunny_duck_mentor}
            alt="Mentor"
            className="z-0 object-contain object-bottom"
            fill
            priority
          />
        </div>
        {/* NEED TO ADD LINK */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-3 xs:bottom-10 sm:bottom-16 left-1/2 transform -translate-x-1/2 font-metropolis font-bold text-base sm:text-xl md:text-2xl lg:text-[36px] leading-[1.2] sm:leading-[1.3] md:leading-[1.4] lg:leading-[40px] tracking-[0.02em] underline text-white z-100 hover:opacity-80 transition-opacity"
        >
          Click Here
        </a>
      </div>
    </main>
  );
}
