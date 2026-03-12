'use client';

import ChooseLevel from '../../slides/ChooseLevel';

type LevelStageProps = {
  value?: string;
  onSelect: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
};

export default function LevelStage({
  value,
  onSelect,
  onBack,
  onNext,
}: LevelStageProps) {
  return (
    <div className="w-full">
      <ChooseLevel value={value} onSelect={onSelect} />

      <div className="mt-6 flex w-full items-center gap-3">
        <button
          type="button"
          className="w-full rounded-lg border border-[#E1E1E8] bg-white py-3 text-sm font-semibold text-[#3F3F3F]"
          onClick={onBack}
        >
          ← Back
        </button>
        <button
          type="button"
          disabled={!value}
          className="w-full rounded-lg border border-[#4C7CF6] bg-[#4C7CF6] py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
          onClick={onNext}
        >
          Finish →
        </button>
      </div>
    </div>
  );
}

