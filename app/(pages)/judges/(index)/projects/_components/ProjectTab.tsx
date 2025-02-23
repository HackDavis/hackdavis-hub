import React from 'react';

interface ProjectTabProps {
  number: string | number;
  name: string;
}

const ProjectTab: React.FC<ProjectTabProps> = ({ number, name }) => {
  return (
    <div className="flex items-center justify-center bg-white rounded-[16px] gap-[24px] py-[20px]">
      <span className="text-[48px] text-[#000000] leading-[60px] font-[600]">
        {number}
      </span>
      <span className="max-w-[137px] break-words text-[24px] text-[#000000] tracking-[0.48px] leading-[30px] font-[500]">
        {name}
      </span>
    </div>
  );
};

export default ProjectTab;
