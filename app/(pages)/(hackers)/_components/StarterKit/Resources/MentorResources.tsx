import Image from 'next/image';
import bunny_duck_mentor from '@public/starter_kit_resources/rabbit_duck_mentor.svg';
export default function MentorResources() {
  return (
    <main className="relative h-[560px] flex flex-col justify-end items-center bg-[#005271] rounded-xl overflow-hidden">
        <div className="relative">
            <Image
                src={bunny_duck_mentor}
                alt="Mentor"
                width={650}
                height={500}
                className="z-0"
            />
            {/* NEED TO ADD LINK */}
            <a 
                href="/" 
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-11 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-metropolis font-bold text-[36px] leading-[40px] tracking-[0.02em] underline text-white z-100 hover:opacity-80 transition-opacity"
            >
                Click Here
            </a>
        </div>
    </main>
  );
}
