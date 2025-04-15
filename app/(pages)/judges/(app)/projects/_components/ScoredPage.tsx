"use client";

import Team from "@typeDefs/team";
import ProjectTab from "./ProjectTab";
interface ScoredPageProps {
  projects: Team[];
}

const ScoredPage = ({ projects }: ScoredPageProps) => {
  return (
    <div className="flex flex-col mt-[4px] gap-[16px] mb-[120px]">
      {projects.map((project) => (
        <ProjectTab key={project._id} team={project} />
      ))}
    </div>
  );
};

export default ScoredPage;
