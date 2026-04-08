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
    <article className="flex h-full flex-col gap-5">
      <div className="relative flex aspect-[1.22] items-center justify-center overflow-hidden rounded-[22px] bg-[#cfeff3]">
        {visual}
      </div>
      <div className="space-y-3">
        <h3 className="font-jakarta text-[1.25rem] font-semibold text-[#1F1F1F]">
          {title}
        </h3>
        <p className="max-w-[20rem] text-[1rem] text-[#000000a6]">
          {description}
        </p>
      </div>
    </article>
  );
}
