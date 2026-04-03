interface IdeateInfoCardProps {
  visual: React.ReactNode;
  title: string;
  description: string;
}

export default function IdeateInfoCard({
  visual,
  title,
  description,
}: IdeateInfoCardProps) {
  return (
    <article className="flex h-full flex-col gap-5 text-text-dark">
      <div className="relative flex aspect-[1.22] items-center justify-center overflow-hidden rounded-[22px] bg-[#cfeff3]">
        {visual}
      </div>
      <div className="space-y-3">
        <h3 className="font-metropolis text-[1.35rem] font-semibold leading-tight md:text-[1.6rem]">
          {title}
        </h3>
        <p className="max-w-[20rem] text-[1rem] leading-[1.15] text-[#58635b] md:text-[1.05rem]">
          {description}
        </p>
      </div>
    </article>
  );
}
