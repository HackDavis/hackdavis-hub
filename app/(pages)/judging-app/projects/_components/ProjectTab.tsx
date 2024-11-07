import React from 'react';

interface ProjectTabProps {
  number: string | number;
  name: string;
}

const ProjectTab: React.FC<ProjectTabProps> = ({ number, name }) => {
  return (
    <div className="tw-flex tw-items-center tw-justify-center tw-bg-white tw-rounded-[16px] tw-gap-[24px] tw-py-[20px]">
      <span className="tw-text-[48px] tw-text-[#000000] tw-leading-[60px] tw-font-[600]">
        {number}
      </span>
      <span className="tw-max-w-[137px] tw-break-words tw-text-[24px] tw-text-[#000000] tw-tracking-[0.48px] tw-leading-[30px] tw-font-[500]">
        {name}
      </span>
    </div>
  );
};

export default ProjectTab;
