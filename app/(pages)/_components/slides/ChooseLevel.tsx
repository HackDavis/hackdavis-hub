'use client';

type ChooseLevelProps = {
  value?: string;
  onSelect: (value: string) => void;
};

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'] as const;

export default function ChooseLevel({ value, onSelect }: ChooseLevelProps) {
  return (
    <div className="flex flex-col gap-6 mt-6">
      <div>
        <h2 className="text-lg md:text-xl font-semibold text-[#3F3F3F]">
          How experienced are you?
        </h2>
        <p className="text-sm md:text-base text-[#5E5E65]">
          We&apos;ll use this to suggest the right resources.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {LEVELS.map((level) => {
          const selected = value === level;
          return (
            <button
              key={level}
              type="button"
              onClick={() => onSelect(level)}
              className={`w-full rounded-xl border px-4 py-3 text-left text-sm md:text-base transition-colors ${
                selected
                  ? 'border-[#4C7CF6] bg-[#EBF1FF] text-[#1D2B64]'
                  : 'border-[#E1E1E8] bg-white text-[#3F3F3F] hover:border-[#C5C5D0]'
              }`}
            >
              {level}
            </button>
          );
        })}
      </div>
    </div>
  );
}

