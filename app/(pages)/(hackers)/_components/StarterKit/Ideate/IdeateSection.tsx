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
          <p className="text-[0.6rem] font-jakarta uppercase tracking-[0.2em] text-text-gray md:text-xs">
            {eyebrow}
          </p>
          <h2 className="mt-1 font-metropolis text-2xl font-bold tracking-[0.02em] text-text-dark md:text-[2rem]">
            {title}
          </h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
