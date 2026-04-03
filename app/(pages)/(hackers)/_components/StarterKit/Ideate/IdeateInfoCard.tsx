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
    <article className="flex h-full flex-col gap-3 rounded-[24px] bg-[#f8ffd5] p-3 text-text-dark shadow-[0_10px_35px_rgba(123,173,52,0.10)] ring-1 ring-[#dcecad] md:p-4">
      <div className="relative flex aspect-[1.05] items-center justify-center overflow-hidden rounded-[20px] bg-[linear-gradient(180deg,#d8f6ff_0%,#bbf1e3_100%)]">
        {visual}
      </div>
      <div className="space-y-2">
        <h3 className="font-metropolis text-lg font-semibold leading-tight md:text-xl">
          {title}
        </h3>
        <p className="text-sm leading-6 text-[#58635b] md:text-[0.95rem]">
          {description}
        </p>
      </div>
    </article>
  );
}
