import Team from '@typeDefs/team';
import ProjectTab from './ProjectTab';
import ProjectsEmptyState from './EmptyState';
interface ScoredPageProps {
  teams: Team[];
}

const ScoredPage = ({ teams }: ScoredPageProps) => {
  return (
    <div className="flex flex-col mt-[4px] gap-[16px] mb-[120px]">
      {teams.length === 0 ? (
        <ProjectsEmptyState
          title="Let's begin!"
          subtitle={
            'No projects scored yet. Please visit the \nUnjudged tab to begin judging.'
          }
        />
      ) : (
        teams.map((team) => <ProjectTab key={team._id} team={team} />)
      )}
    </div>
  );
};

export default ScoredPage;
