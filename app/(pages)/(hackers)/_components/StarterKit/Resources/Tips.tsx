import Image from 'next/image';
import type { StaticImageData } from 'next/image';

interface Tip {
  icon?: StaticImageData;
  title?: string;
  tip: string;
}

export function Tips({
  image,
  subtitle,
  title,
  description,
  tips,
  reverse,
}: {
  image: StaticImageData;
  subtitle: string;
  title: string;
  description: string;
  tips: Tip[];
  reverse: boolean;
}) {
  return (
    <div
      className={
        'flex flex-col gap-[60px] items-start' +
        (reverse ? ' min-[1075px]:flex-row-reverse' : ' min-[1075px]:flex-row')
      }
    >
      <Image
        src={image}
        alt={`${title} image`}
        className="w-full min-[1075px]:w-[440px]"
      />
      <div className="flex flex-col gap-[12px]">
        <p className="text-[16px] opacity-[0.40] font-mono">{subtitle}</p>
        <p className="text-[20px] font-medium">{title}</p>
        <p className="text-[16px] opacity-[0.65]">{description}</p>
        <div className="w-full border-[1px] border-[#C0E4E6] rounded-full my-[8px] " />
        {tips.map((tip, index) => (
          <div
            key={index}
            className="text-[16px] opacity-[0.65] flex flex-row gap-[8px] items-start"
          >
            {tip.icon ? (
              <Image src={tip.icon} alt={`${tip.title} icon`} className="" />
            ) : (
              <p className="text-nowrap">{`0${index + 1}.`}</p>
            )}
            <div className="flex flex-row gap-[4px]">
              <p className="text-wrap">
                {tip.title && (
                  <span className="font-semibold text-nowrap">
                    {tip.title}:
                  </span>
                )}{' '}
                {tip.tip}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
