import Image from 'next/image';
import { useEffect } from 'react';
import mascots_celebrate from '@public/hackers/hero/hero-judging/mascots_celebrate.svg';

interface DoneJudgingModalProps {
  onClose: () => void;
}

export default function DoneJudgingModal({ onClose }: DoneJudgingModalProps) {
  // Close modal when user pressed Escape key or clicks outside
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative flex flex-col bg-white p-[40px] w-[500px] rounded-[20px] gap-[12px]">
        <Image
          src={mascots_celebrate}
          alt="hackdavis mascots celebrating"
          width={420}
          height={287}
        />
        <h2 className="text-[32px] font-medium">Congratulations Hacker!</h2>
        <p className="text-[16px] text-[#5E5E65] font-normal">
          You’re all done, thank you so much for your participation at HackDavis
          2026. Please wait until <b>Closing Ceremony</b> for judging results!
          In the meantime, put in your vote for{' '}
          <a
            href=""
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-bold"
          >
            Hacker’s Choice Award.
          </a>
        </p>
      </div>
    </div>
  );
}
