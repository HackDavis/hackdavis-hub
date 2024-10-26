'use client';

import { useSubmissions } from '@hooks/useSubmissions';
import ProjectsCard from './ProjectsCard';
import styles from './ProjectsCard.module.scss';

interface Team {
  _id: string;
  number: number;
  name: string;
  tracks: string[];
}

export default function ProjectsList({ activeTab }: { activeTab: number }) {
  const { loading, judgedTeams, unjudgedTeams } = useSubmissions();
  if (loading) {
    return 'loading...';
  }

  const renderScoredProjects = () => {
    return (
      <div className={styles.container}>
        {judgedTeams.map((project: Team, index: number) => (
          <ProjectsCard
            key={index}
            team_id={project._id}
            num={project.number}
            name={project.name}
            categories={project.tracks}
          />
        ))}
      </div>
    );
  };
  const renderuUnjudgedProjects = () => {
    return (
      <div className={styles.container}>
        {unjudgedTeams.map((project: Team, index: number) => (
          <ProjectsCard
            key={index}
            team_id={project._id}
            num={project.number}
            name={project.name}
            categories={project.tracks}
          />
        ))}
      </div>
    );
  };

  return (
    <div>{activeTab ? renderScoredProjects() : renderuUnjudgedProjects()}</div>
  );
}
