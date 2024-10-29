'use client';
import React, { useState } from 'react';
import { FaChevronLeft } from 'react-icons/fa6';
import UnjudgedPage from './UnjudgedPage';
import ScoredPage from './ScoredPage';

interface ButtonProps {
  text: string;
  isSelected: boolean;
  width: string;
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({
  text,
  isSelected,
  width,
  onClick,
}) => (
  <button
    className={`${width} tw-h-[42px] tw-border-[1.5px] tw-border-[#005271] tw-border-solid tw-rounded-[20px] tw-text-[#005271] tw-text-lg tw-font-semibold tw-tracking-[0.36px] tw-flex tw-items-center tw-justify-center ${
      isSelected ? 'tw-bg-[#9EE7E5]' : 'tw-bg-white'
    }`}
    onClick={onClick}
  >
    {text}
  </button>
);

const ProjectPage = () => {
  const [selectedButton, setSelectedButton] = useState<'Unjudged' | 'Scored'>(
    'Unjudged'
  );

  return (
    <div>
      <div className="tw-flex tw-items-center tw-ml-[20px] tw-gap-[12px] tw-mt-[59px]">
        <FaChevronLeft fill="#005271" height={8.48} width={4.24} />
        <span className="tw-font-semibold tw-text-[18px] tw-tracking-[0.36px] tw-text-[#005271] tw-leading-[100%]">
          Back to Projects
        </span>
      </div>
      <div className="tw-flex tw-flex-col tw-px-[20px] tw-mt-[24px]">
        <span className="tw-font-bold tw-text-[48px] tw-tracking-[0.96px] tw-text-[#000000] ">
          Project
        </span>
      </div>
      <div className="tw-flex tw-px-[20px] tw-space-x-[8px] tw-bg-white tw-mb-[32px]">
        <Button
          text="Unjudged"
          isSelected={selectedButton === 'Unjudged'}
          width="tw-w-[136px]"
          onClick={() => setSelectedButton('Unjudged')}
        />
        <Button
          text="Scored"
          isSelected={selectedButton === 'Scored'}
          width="tw-w-[114px]"
          onClick={() => setSelectedButton('Scored')}
        />
      </div>
      <div className="tw-px-[20px]">
        {selectedButton === 'Unjudged' ? <UnjudgedPage /> : <ScoredPage />}
      </div>
    </div>
  );
};

export default ProjectPage;
