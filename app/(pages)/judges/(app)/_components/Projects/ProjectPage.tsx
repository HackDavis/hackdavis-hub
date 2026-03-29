'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { FaChevronLeft } from 'react-icons/fa6';
import { useJudgeSubmissions } from '@pages/_hooks/useJudgeSubmissions';
import UnscoredPage from './UnscoredPage';
import ScoredPage from './ScoredPage';
import Link from 'next/link';
import Loader from '@pages/_components/Loader/Loader';
import ProjectTab from './ProjectTab';
import Team from '@typeDefs/team';

interface ButtonProps {
  text: string;
  isSelected: boolean;
  badgeCount?: number;
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({
  text,
  isSelected,
  badgeCount,
  onClick,
}) => (
  <div className="relative">
    <button
      onClick={onClick}
      className={`px-[24px] py-[12px] rounded-full text-[18px] font-semibold transition-colors ${
        isSelected
          ? 'bg-[#3D3D3D] text-white border-[1px] border-[#3D3D3D]'
          : 'bg-transparent text-[#3D3D3D] border-[1px] border-dashed border-[#AAAAAA]'
      }`}
    >
      {text}
    </button>
    {badgeCount !== undefined && (
      <span className="absolute -top-[10px] -right-[10px] bg-[#F4847A] text-white text-[14px] font-bold w-[28px] h-[28px] rounded-full flex items-center justify-center">
        {badgeCount}
      </span>
    )}
  </div>
);

const ProjectPage = () => {
  const [selectedButton, setSelectedButton] = useState<
    'Unjudged' | 'Scored' | 'Missing Team'
  >('Unjudged');
  const { data: session } = useSession();
  const user = session?.user;
  const userId = user?.id;

  const { scoredTeams, unscoredTeams, loading, error, fetchSubmissions } =
    useJudgeSubmissions(userId);

  const allUnscoredTeams = (unscoredTeams ?? []) as Team[];
  const missingTeams = allUnscoredTeams.filter((team) =>
    (team.reports ?? []).some((report) => report.judge_id === userId)
  );
  const visibleUnscoredTeams = allUnscoredTeams.filter(
    (team) => !(team.reports ?? []).some((report) => report.judge_id === userId)
  );

  useEffect(() => {
    if (selectedButton === 'Missing Team' && missingTeams.length === 0) {
      setSelectedButton('Unjudged');
    }
  }, [missingTeams.length, selectedButton]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return error;
  }

  return (
    <div className="flex flex-col h-full my-[40px] mx-[24px]">
      <Link href="/judges" className="flex items-center my-[12px] gap-[12px]">
        <FaChevronLeft fill="#005271" height={8.48} width={4.24} />
        <span className="font-semibold text-[18px] text-[#121212]">
          Back to home
        </span>
      </Link>

      <div className="my-[12px]">
        <span className="font-bold text-[48px] text-black block">Projects</span>
      </div>

      <div className="flex gap-[8px] mb-[32px]">
        <Button
          text="Unjudged"
          isSelected={selectedButton === 'Unjudged'}
          badgeCount={visibleUnscoredTeams.length}
          onClick={() => setSelectedButton('Unjudged')}
        />
        <Button
          text="Scored"
          isSelected={selectedButton === 'Scored'}
          onClick={() => setSelectedButton('Scored')}
        />
        {missingTeams.length > 0 && (
          <Button
            text="Missing Team"
            isSelected={selectedButton === 'Missing Team'}
            onClick={() => setSelectedButton('Missing Team')}
          />
        )}
      </div>

      <div>
        {loading ? (
          <Loader />
        ) : error ? (
          <div className="bg-red-100 p-4 rounded">
            <p className="text-red-800">{error}</p>
          </div>
        ) : selectedButton === 'Unjudged' ? (
          <UnscoredPage
            teams={visibleUnscoredTeams}
            revalidateData={() => fetchSubmissions()}
          />
        ) : selectedButton === 'Missing Team' ? (
          <div className="flex flex-col gap-[24px]">
            {missingTeams.map((team) => (
              <ProjectTab key={team._id} team={team} disabled />
            ))}
          </div>
        ) : (
          <ScoredPage teams={scoredTeams} />
        )}
      </div>
    </div>
  );
};

export default ProjectPage;
