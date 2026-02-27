'use client';

import { RxCross1 } from 'react-icons/rx';

export default function HackbotHeader({
  firstName,
  onClose,
}: {
  firstName: string | undefined;
  onClose: () => void;
}) {
  return (
    <header
      className="flex items-center justify-between px-4 py-3 shrink-0"
      style={{ backgroundColor: '#005271' }}
    >
      <div>
        <p className="text-sm font-bold text-white">HackDavis Helper</p>
        <p className="text-[11px] text-[#9EE7E5]">
          {firstName
            ? `Hi ${firstName}! Ask me anything about HackDavis.`
            : 'Ask me anything about HackDavis!'}
        </p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="h-7 w-7 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors"
        aria-label="Close chat"
      >
        <RxCross1 className="w-3.5 h-3.5" />
      </button>
    </header>
  );
}
