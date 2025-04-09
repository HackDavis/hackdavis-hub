import Link from 'next/link';
import Team from '@typeDefs/team';
import ProjectTab from './ProjectTab';
interface ScoredPageProps {
  teams: Team[];
}

const ScoredPage = ({ teams }: ScoredPageProps) => {
  return (
    <div className="flex flex-col mt-[4px] gap-[16px] mb-[120px]">
      {teams.length === 0 ? (
        <div className="bg-gray-100 p-6 rounded-lg text-center">
          <p className="text-gray-600">No scored projects yet.</p>
        </div>
      ) : (
        teams.map((team) => (
          <Link
            key={team._id}
            href={`/judges/project/${team._id}`}
            className="block"
          >
            <ProjectTab team={team} />
          </Link>
        ))
      )}
    </div>
  );
};

export default ScoredPage;
