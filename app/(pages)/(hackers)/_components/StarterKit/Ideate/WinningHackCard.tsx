import Image, { StaticImageData } from 'next/image';

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
      <article className="flex flex-col gap-4 rounded-[20px] bg-white px-4 py-4 shadow-[0_12px_35px_rgba(134,137,116,0.08)] md:flex-row md:items-center md:gap-6 md:px-4 md:py-3">
        <div className="relative flex aspect-[1.5] w-full items-center justify-center overflow-hidden rounded-[14px] bg-[#f8f8fb] ring-1 ring-[#efefef] md:w-[240px] md:flex-shrink-0">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 240px"
            />
          ) : (
            visual
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2 md:gap-3">
          <p className="font-dm-mono text-[1rem] uppercase text-[#00000066]">
            {award} {year}
          </p>
          <h3 className="font-metropolis text-[1.25rem] font-semibold text-[#1F1F1F]">
            {title}
          </h3>
          <p className="max-w-[42rem] text-[1rem] text-[#000000a6]">
            {description}
          </p>
        </div>
      </article>
    </a>
  );
}
