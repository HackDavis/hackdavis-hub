'use client';

import Image from 'next/image';

type LevelStageProps = {
  value?: string;
  onSelect: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
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
}: LevelStageProps) {
  return (
    <div className="w-full">
      {/* header */}
      <div className="mb-10">
        <h2 className="text-[20px] font-semibold text-[#3F3F3F]">
          Tell us your skill level:
        </h2>
        <p className="text-[14px] text-[#6B6B76]">
          This will help us recommend workshops to you!
        </p>
      </div>

      {/* cards */}
      <div className="grid grid-cols-2 gap-6">
        {levels.map((level) => {
          const selected = value === level.id;

          return (
            <button
              key={level.id}
              onClick={() => onSelect(level.id)}
              className={`
                flex flex-col items-start
                rounded-2xl
                p-8
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
                className="mb-6 self-center drop-shadow"
              />

              <h3 className="text-[22px] font-semibold text-[#3F3F3F] mb-2">
                {level.title}
              </h3>

              <div
                className={`
                  mb-3 px-3 py-1 text-[11px] font-semibold tracking-wide text-[#5A5A66]
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
      <div className="mt-10 flex flex-col items-center gap-6">
        
        {/* indicators */}
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#D6D6DE]" />
          <div className="h-2 w-2 rounded-full bg-[#2F2F2F]" />
        </div>

        {/* nav buttons */}
        <div className="flex w-full items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="text-[16px] font-medium text-[#5E5E65] hover:text-[#3F3F3F]"
          >
            Back
          </button>

          <button
            type="button"
            disabled={!value}
            onClick={onNext}
            className="
              flex items-center gap-2
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
        </div>
      </div>
    </div>
  );
}