'use client';

export default function HackbotHeader({
  firstName,
}: {
  firstName: string | undefined;
}) {
  return (
    <header className="px-4 py-3 shrink-0 rounded-t-3xl bg-[#EDFFFE] border-b border-[#9EE7E5]/40">
      <p className="text-sm font-bold text-[#003D3D] tracking-tight">
        Hacky AI
      </p>
      <p className="text-xs text-[#005271]/70 mt-0.5">
        {firstName
          ? `Hi ${firstName}! Ask me anything about HackDavis.`
          : 'Ask me anything about HackDavis!'}
      </p>
    </header>
  );
}
