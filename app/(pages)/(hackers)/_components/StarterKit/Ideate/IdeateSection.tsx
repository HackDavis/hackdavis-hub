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
  const normalizedEyebrow = eyebrow.trim();
  const normalizedTitle = title.trim();
  const hasHeaderContent =
    Boolean(normalizedEyebrow) || Boolean(normalizedTitle) || Boolean(action);

  return (
    <section className="flex flex-col gap-4 md:gap-6">
      {hasHeaderContent ? (
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            {normalizedEyebrow ? (
              <p className="text-[1rem] font-dm-mono uppercase text-[#00000066]">
                {normalizedEyebrow}
              </p>
            ) : null}
            {normalizedTitle ? (
              <h2 className="mt-1 font-jakarta text-[28px] font-semibold text-[#3F3F3F] md:text-[32px]">
                {normalizedTitle}
              </h2>
            ) : null}
          </div>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}
