import Image, { StaticImageData } from 'next/image';
import { ArrowUpRight } from 'lucide-react';

interface WinningHackCardProps {
  award: string;
  year: string;
  title: string;
  description: string;
  link: string;
  image?: StaticImageData;
  visual?: React.ReactNode;
}

export default function WinningHackCard({
  award,
  year,
  title,
  description,
  link,
  image,
  visual,
}: WinningHackCardProps) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <article className="flex flex-col gap-4 rounded-[24px] bg-white/95 p-3 shadow-[0_12px_40px_rgba(134,137,116,0.12)] ring-1 ring-[#edf0d7] transition-transform duration-200 hover:-translate-y-1 md:flex-row md:items-center md:gap-5 md:p-4">
        <div className="relative flex aspect-[1.45] w-full items-center justify-center overflow-hidden rounded-[18px] bg-[linear-gradient(180deg,#f7f7ff_0%,#eff3ff_100%)] md:w-[200px]">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 200px"
            />
          ) : (
            visual
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <p className="text-[0.62rem] font-jakarta uppercase tracking-[0.18em] text-text-gray md:text-[0.7rem]">
            {award} • {year}
          </p>
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-metropolis text-xl font-semibold leading-tight text-text-dark md:text-2xl">
              {title}
            </h3>
            <ArrowUpRight className="mt-1 h-5 w-5 flex-shrink-0 text-[#6b7170] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
          <p className="text-sm leading-6 text-[#58635b] md:text-[0.95rem]">
            {description}
          </p>
        </div>
      </article>
    </a>
  );
}
