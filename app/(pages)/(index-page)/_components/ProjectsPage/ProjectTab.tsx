import React from 'react';

interface ProjectTabProps {
  number: string | number;
  name: string;
}

const ProjectTab: React.FC<ProjectTabProps> = ({ number, name }) => {
  return (
    <div className="flex items-center gap-6 bg-white rounded-2xl p-4">
      <span>{number}</span>
      <span className="max-w-[137px] break-words">{name}</span>
    </div>
  );
};

export default ProjectTab;
