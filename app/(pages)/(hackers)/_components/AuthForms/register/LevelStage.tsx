'use client';

import Image from 'next/image';
import AuthFormBackground from '../../AuthFormBackground/AuthFormBackground';

type LevelStageProps = {
  value?: string;
  onSelect: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
  loading?: boolean;
  error?: string;
};

const levels = [
  {
    id: 'beginner',
    title: 'Beginner',
    tag: 'NEW TO THE SCENE',
    description:
      "You're here to build your foundation, explore new tools, and ship your first few projects.",
    image: '/hackers/register/beginner-frog.svg',
  },
  {
    id: 'experienced',
    title: 'Experienced',
    tag: 'A SEASONED HACKER',
    description:
      "You're comfortable with the 36-hour grind and ready to push the boundaries of your projects.",
    image: '/hackers/register/experienced-frog.svg',
  },
];

export default function LevelStage({
  value,
  onSelect,
  onBack,
  onNext,
  loading = false,
  error = '',
}: LevelStageProps) {
  return (
    <AuthFormBackground
      title="Tell us your skill level:"
      subtitle="This will help us recommend workshops to you!"
      showAngelCow={false}
    >
      <div className="w-full mt-[40px]">
        {/* cards (ALWAYS SIDE BY SIDE) */}
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {levels.map((level) => {
            const selected = value === level.id;
            return (
              <button
                key={level.id}
                onClick={() => onSelect(level.id)}
                className={`
                flex flex-col items-start
                h-[392px] md:h-[444px]
                rounded-2xl
                p-6 md:p-8
                text-left
                border
                transition
                ${
                  selected
                    ? 'bg-[#EAFEFF] border-[#45F1FC]'
                    : 'bg-[#F4F4FA] border-transparent hover:bg-[#EDEDF6]'
                }
              `}
              >
                <Image
                  src={level.image}
                  alt={level.title}
                  width={110}
                  height={110}
                  className="mb-6 self-center drop-shadow-[0_10px_18px_rgba(0,0,0,0.18)]"
                />

                <h3 className="text-[18px] md:text-[22px] font-semibold text-[#3F3F3F] mb-2">
                  {level.title}
                </h3>

                <div
                  className={`
                  mb-3 px-[8px] py-[4px] text-[11px] tracking-wide text-[#5A5A66] font-dm-mono
                  ${selected ? 'bg-[#D5FDFF]' : 'bg-[#E9E9F2]'}
                `}
                >
                  {level.tag}
                </div>

                <p className="text-[14px] leading-relaxed text-[#6B6B76]">
                  {level.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* footer */}
        <div className="mt-[16px] flex flex-col items-center ">
          {/* indicators */}
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#D6D6DE]" />
            <div className="h-2 w-2 rounded-full bg-[#2F2F2F]" />
          </div>
          {/* nav buttons */}
          <div className="w-full">
            {/* error message - takes up vertical space*/}
            <p
              className={`h-12 md:h-6 text-right text-sm transition-opacity ${
                error ? 'text-red-500 opacity-100' : 'opacity-0'
              }`}
            >
              {error}
            </p>
            <div className="flex flex-col md:flex-row w-full gap-3 md:gap-0 md:justify-between">
              {/* NEXT (top on mobile) */}
              <button
                type="button"
                disabled={!value || loading}
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
                {loading ? 'Saving...' : 'Next →'}
              </button>

              {/* BACK */}
              <button
                type="button"
                disabled={loading}
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
        </div>
      </div>
    </AuthFormBackground>
  );
}
