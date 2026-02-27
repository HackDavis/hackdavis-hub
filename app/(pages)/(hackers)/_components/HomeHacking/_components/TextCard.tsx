import Link from 'next/link';
import Image from 'next/image';
import button_arrow from 'public/hackers/beginners/button_arrow.svg';

interface TextCardProps {
  short_text: string;
  title: string;
  long_text: string;
  button_text: string;
  button_link: string;
  button_color: string;
  text_color: string;
  is_external?: boolean;
}

export default function TextCard({
  short_text,
  title,
  long_text,
  button_text,
  button_link,
  button_color,
  text_color,
  is_external = false,
}: TextCardProps) {
  return (
    <div style={{ color: `#${text_color}` }} className="flex flex-col gap-4">
      <p>{short_text}</p>
      <h2 className="font-semibold">{title}</h2>
      <p>{long_text}</p>
      <Link
        href={button_link}
        target={is_external ? '_blank' : '_self'}
        rel={is_external ? 'noopener noreferrer' : undefined}
        className="mt-8"
      >
        <button
          style={{ backgroundColor: `#${button_color}` }}
          className="group flex flex-row items-center justify-center gap-[10px] px-10 py-5 md:px-[50px] md:py-[40px] rounded-[1000px] text-[#003D3D] font-semibold transition-all duration-300 active:brightness-90"
        >
          {button_text}
          <div className="relative flex items-center overflow-hidden w-6 h-6">
            <div className="absolute left-0 transition-transform duration-300 ease-in-out -translate-x-2 group-hover:translate-x-0">
              <Image
                src={button_arrow}
                alt="arrow"
                className="max-w-none"
                width={24}
                height={24}
              />
            </div>
          </div>
        </button>
      </Link>
    </div>
  );
}
