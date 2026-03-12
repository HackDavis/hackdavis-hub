'use client';

import ChooseRole from '../../slides/ChooseRole';

type RoleStageProps = {
  value?: string;
  onSelect: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
};

export default function RoleStage({
  value,
  onSelect,
  onBack,
  onNext,
}: RoleStageProps) {
  return (
    <div className="w-full">
      <ChooseRole value={value} onSelect={onSelect} />

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
          Next →
        </button>
      </div>
    </div>
  );
}

