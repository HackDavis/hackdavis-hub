'use client';

import Image from 'next/image';
import AuthFormBackground from '../../AuthFormBackground/AuthFormBackground';

type ChooseRoleProps = {
  value?: string;
  onSelect: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
};

const roles = [
  {
    id: 'developer',
    label: 'Developer',
    image: '/hackers/register/dev-cow.svg',
  },
  {
    id: 'designer',
    label: 'Designer',
    image: '/hackers/register/designer-bunny.svg',
  },
  {
    id: 'product',
    label: 'Product',
    image: '/hackers/register/product-frog.svg',
  },
  {
    id: 'explorer',
    label: 'Other',
    image: '/hackers/register/explorer-duck.svg',
  },
];

export default function ChooseRole({
  value,
  onSelect,
  onBack,
  onNext,
}: ChooseRoleProps) {
  return (
    <AuthFormBackground
      title="Choose what suits you the most:"
      subtitle="This will help us recommend workshops to you!"
      showAngelCow={false}
    >
      {/* cards */}
      <div className="grid grid-cols-2 gap-3 md:gap-6 mt-[40px]">
        {roles.map((role) => {
          const selected = value === role.id;
          return (
            <button
              key={role.id}
              onClick={() => onSelect(role.id)}
              className={`
                relative
                h-[190px] md:h-[210px]
                rounded-2xl
                border
                transition
                flex
                items-center
                justify-center
                ${
                  selected
                    ? 'bg-[#EAFEFF] border-[#45F1FC]'
                    : 'bg-[#FAFAFF] border-transparent hover:bg-[#EDEDF6]'
                }
              `}
            >
              <Image
                src={role.image}
                alt={role.label}
                width={120}
                height={120}
                className="pointer-events-none drop-shadow-[0_8px_14px_rgba(0,0,0,0.15)]"
              />

              <div
                className={`font-dm-mono absolute bottom-3 md:bottom-4 left-3 md:left-4 px-3 py-1 text-xs tracking-wide text-[#555] rounded ${
                  selected ? 'bg-[#DBFDFF]' : 'bg-[#F3F3FC]'
                }`}
              >
                {role.label.toUpperCase()}
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom navigation */}
      <div className="mt-[16px] flex flex-col items-center gap-12 md:gap-6">
        {/* indicators */}
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#2F2F2F]" />
          <div className="h-2 w-2 rounded-full bg-[#D6D6DE]" />
        </div>

        {/* nav buttons */}
        <div className="flex flex-col md:flex-row w-full gap-3 md:gap-0 md:justify-between">
          {/* NEXT (top on mobile) */}
          <button
            type="button"
            disabled={!value}
            onClick={onNext}
            className="
              order-1 md:order-2
              w-full md:w-auto
              flex items-center justify-center gap-2
              rounded-full
              bg-[#0F5C74]
              px-8 py-3
              text-[16px] font-semibold
              text-white
              transition
              hover:bg-[#0C4A5C]
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            Next →
          </button>

          {/* BACK */}
          <button
            type="button"
            onClick={onBack}
            className="
              order-2 md:order-1
              w-full md:w-auto
              text-[16px] font-medium text-[#5E5E65]
              hover:text-[#3F3F3F]
            "
          >
            Back
          </button>
        </div>
      </div>
    </AuthFormBackground>
  );
}
