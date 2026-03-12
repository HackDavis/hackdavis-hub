'use client';

type ChooseRoleProps = {
  value?: string;
  onSelect: (value: string) => void;
};

const ROLES = ['Developer', 'Designer', 'Product', 'Explorer'] as const;

export default function ChooseRole({ value, onSelect }: ChooseRoleProps) {
  return (
    <div className="flex flex-col gap-6 mt-6">
      <div>
        <h2 className="text-lg md:text-xl font-semibold text-[#3F3F3F]">
          Tell us about your role
        </h2>
        <p className="text-sm md:text-base text-[#5E5E65]">
          This helps us tailor your HackDavis experience.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ROLES.map((role) => {
          const selected = value === role;
          return (
            <button
              key={role}
              type="button"
              onClick={() => onSelect(role)}
              className={`w-full rounded-xl border px-4 py-3 text-left text-sm md:text-base transition-colors ${
                selected
                  ? 'border-[#4C7CF6] bg-[#EBF1FF] text-[#1D2B64]'
                  : 'border-[#E1E1E8] bg-white text-[#3F3F3F] hover:border-[#C5C5D0]'
              }`}
            >
              {role}
            </button>
          );
        })}
      </div>
    </div>
  );
}
