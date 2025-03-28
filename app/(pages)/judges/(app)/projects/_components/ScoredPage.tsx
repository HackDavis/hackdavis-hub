'use client';

import ProjectTab from './ProjectTab';
interface ScoredPageProps {
  projects: { _id: string; teamNumber: number; name: string }[];
}

const ScoredPage = ({ projects }: ScoredPageProps) => {
  return (
    <div className="flex flex-col mt-[4px] gap-[16px] mb-[120px]">
      {projects.map((project) => (
        <ProjectTab
          key={project._id}
          number={project.teamNumber}
          name={project.name}
        />
      ))}
    </div>
  );
};

export default ScoredPage;
