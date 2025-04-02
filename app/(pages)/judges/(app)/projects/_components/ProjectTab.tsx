import Team from '@typeDefs/team';
import Link from 'next/link';
interface ProjectTabProps {
  team: Team;
  clickable?: boolean;
}

const ProjectTab: React.FC<ProjectTabProps> = ({ team, clickable = true }) => {
  return (
    <Link
      href={`/judges/score/${team._id}`}
      className={`flex items-center justify-start bg-white rounded-[16px] gap-[24px] px-16 py-[20px] ${
        clickable ? '' : 'pointer-events-none'
      }`}
    >
      <span className="text-[48px] text-[#000000] leading-[60px] font-[600] mr-6">
        {team.teamNumber}
      </span>
      <span className="max-w-[137px] break-words text-[24px] text-[#000000] tracking-[0.48px] leading-[30px] font-[500]">
        {team.name}
      </span>
    </Link>
  );
};

export default ProjectTab;
