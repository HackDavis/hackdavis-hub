import React from 'react';
import ProjectTab from './ProjectTab';

const scoredProjects = [
  { id: 17, name: 'Not Haptic Hand' },
  { id: 20, name: 'Fun fun project' },
  { id: 80, name: 'Happy name' },
  { id: 36, name: 'Another Happy name' },
];

const ScoredPage = () => {
  return (
    <div className="tw-flex tw-flex-col tw-mt-[4px] tw-gap-[16px] tw-mb-[120px]">
      {scoredProjects.map((project) => (
        <ProjectTab key={project.id} number={project.id} name={project.name} />
      ))}
    </div>
  );
};

export default ScoredPage;
