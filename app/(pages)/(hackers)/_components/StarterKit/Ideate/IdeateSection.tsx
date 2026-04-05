interface IdeateSectionProps {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export default function IdeateSection({
  eyebrow,
  title,
  children,
  action,
}: IdeateSectionProps) {
  return (
    <section className="flex flex-col gap-4 md:gap-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="text-[1rem] font-dm-mono uppercase text-[#00000066]">
            {eyebrow}
          </p>
          <h2 className="mt-1 font-jakarta text-[28px] md:text-[32px] font-semibold text-[#3F3F3F]">
            {title}
          </h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
