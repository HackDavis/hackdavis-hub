import Team from '@typeDefs/team';
import Link from 'next/link';
interface ProjectTabProps {
  team: Team;
  disabled?: boolean;
}

const ProjectTab: React.FC<ProjectTabProps> = ({ team, disabled }) => {
  return (
    <Link
      href={`/judges/score/${team._id}`}
      className="flex items-center justify-center bg-[#F3F3FC] rounded-[24px] gap-[14px] py-[12px] px-[24px]"
      style={{
        pointerEvents: disabled ? 'none' : 'auto',
      }}
    >
      <span className="text-[32px] text-[#707070] font-semibold">
        {team.tableNumber}
      </span>
      <span className="text-[18px] text-[#707070] font-semibold">
        {team.name}
      </span>
    </Link>
  );
};

export default ProjectTab;
