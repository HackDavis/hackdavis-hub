'use client';

import Image from 'next/image';

type ChooseRoleProps = {
  value?: string;
  onSelect: (value: string) => void;
};

const roles = [
  {
    id: 'developer',
    label: 'Developer',
    image: '/characters/developer.png',
  },
  {
    id: 'designer',
    label: 'Designer',
    image: '/characters/designer.png',
  },
  {
    id: 'product',
    label: 'Product',
    image: '/characters/product.png',
  },
  {
    id: 'explorer',
    label: 'Explorer',
    image: '/characters/explorer.png',
  },
];

export default function ChooseRole({ value, onSelect }: ChooseRoleProps) {
  return (
    <>
    {/* header */}
    <div className="mb-8">
        <h2 className="text-[20px] font-semibold text-[#3F3F3F]">
          Choose what suits you the most:
        </h2>
        <p className="text-[14px] text-[#6B6B76]">
          This will help us recommend workshops to you!
        </p>
      </div>
      
    <div className="grid grid-cols-2 gap-6">
      {roles.map((role) => {
        const selected = value === role.id;

        return (
          <button
            key={role.id}
            onClick={() => onSelect(role.id)}
            className={`
              relative
              h-[210px]
              rounded-2xl
              border
              transition
              flex
              items-center
              justify-center
              
              ${
                selected
                  ? 'bg-[#EAF1FF] border-[#4C7CF6]'
                  : 'bg-[#F5F5F8] border-transparent hover:bg-[#E6E6EB]'
              }
            `}
          >
            {/* Character */}
            <Image
              src={role.image}
              alt={role.label}
              width={120}
              height={120}
              className="pointer-events-none"
            />

            {/* Role label */}
            <div className="absolute bottom-4 left-4 bg-[#ECECF1] px-3 py-1 text-xs font-semibold tracking-wide text-[#555] rounded">
              {role.label.toUpperCase()}
            </div>
          </button>
        );
      })}
    </div>
    </>
  );
}