import Image from 'next/image';
import bunny_duck_mentor from '@public/starterKIt/rabbit_duck_mentor.svg';
export default function MentorResources() {
  return (
    <main className="relative pt-[10%] w-full aspect-[2] flex flex-col justify-end items-center bg-[#005271] rounded-xl overflow-hidden">
      <div className="relative w-full h-full">
        <div className="relative w-full h-full flex items-end justify-end">
          <Image
            src={bunny_duck_mentor}
            alt="Mentor"
            className="z-0 object-contain object-bottom"
            fill
            priority
          />
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-[10%] md:bottom-[15%] left-1/2 transform -translate-x-1/2 font-metropolis font-bold text-xs sm:text-lg md:text-2xl lg:text-4xl tracking-[0.02em] underline text-white z-100 hover:opacity-80 transition-opacity"
          >
            Click Here
          </a>
        </div>
        {/* TODO: NEED TO ADD LINK */}
      </div>
    </main>
  );
}
