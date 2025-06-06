import Image from 'next/image';
import bunny_duck_mentor from '@public/starterKit/rabbit_duck_mentor.svg';
import StarterKitSlide from '../StarterKitSlide';
export default function MentorResources() {
  return (
    <StarterKitSlide title="Talk with a Mentor" subtitle="STILL FEELIN STUCK?">
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
              href="https://discord.gg/Ba5xAtf8"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-[10%] md:bottom-[15%] left-1/2 transform -translate-x-1/2 font-metropolis font-bold text-xs sm:text-lg md:text-2xl lg:text-4xl tracking-[0.02em] underline text-white z-100 hover:opacity-80 transition-opacity"
            >
              Click Here
            </a>
          </div>
        </div>
      </main>
    </StarterKitSlide>
  );
}
