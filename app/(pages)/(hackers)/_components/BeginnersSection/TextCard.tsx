import Link from 'next/link';
import Image from 'next/image';
import button_arrow from 'public/hackers/mvp/beginners/button_arrow.svg';

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
          className="flex flex-row items-center justify-center gap-[10px] px-[50px] py-[40px] rounded-[1000px] text-[#003D3D] font-semibold"
        >
          {button_text}
          <Image src={button_arrow} alt="small arrow" />
        </button>
      </Link>
    </div>
  );
}
