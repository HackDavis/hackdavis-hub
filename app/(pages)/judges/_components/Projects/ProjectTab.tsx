import Team from '@typeDefs/team';
import Link from 'next/link';
interface ProjectTabProps {
  team: Team;
}

const ProjectTab: React.FC<ProjectTabProps> = ({ team }) => {
  return (
    <Link
      href={`/judges/score/${team._id}`}
      className="flex items-center justify-center bg-white rounded-[16px] gap-[24px] py-[20px]"
    >
      <span className="text-[48px] text-[#000000] leading-[60px] font-[600]">
        {team.tableNumber}
      </span>
      <span className="max-w-[137px] break-words text-[24px] text-[#000000] tracking-[0.48px] leading-[30px] font-[500]">
        {team.name}
      </span>
    </Link>
  );
};

export default ProjectTab;
