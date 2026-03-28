'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { FaChevronLeft } from 'react-icons/fa6';
import { useJudgeSubmissions } from '@pages/_hooks/useJudgeSubmissions';
import UnscoredPage from './UnscoredPage';
import ScoredPage from './ScoredPage';
import Link from 'next/link';
import Loader from '@pages/_components/Loader/Loader';

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
      className={`h-[48px] px-[28px] rounded-full text-[18px] font-semibold transition-colors ${
        isSelected
          ? 'bg-[#3D3D3D] text-white'
          : 'bg-transparent text-[#3D3D3D] border-[2.5px] border-dashed border-[#AAAAAA]'
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
  const [selectedButton, setSelectedButton] = useState<'Unjudged' | 'Scored'>(
    'Unjudged'
  );
  const { data: session } = useSession();
  const user = session?.user;
  const userId = user?.id;

  const { scoredTeams, unscoredTeams, loading, error, fetchSubmissions } =
    useJudgeSubmissions(userId);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return error;
  }

  return (
    <div className="flex flex-col h-full bg-[#FAFAFF]">
      <Link
        href="/judges"
        className="flex items-center ml-[20px] gap-[12px] mt-[59px]"
      >
        <FaChevronLeft fill="#121212" height={8.48} width={4.24} />
        <span className="font-semibold text-[18px] tracking-[0.36px] text-[#121212] leading-[100%]">
          Back to home
        </span>
      </Link>

      <div className="px-[20px] mt-[44px] mb-[20px]">
        <span className="font-bold text-[48px] leading-none text-black block">
          Projects
        </span>
      </div>

      <div className="flex px-[20px] gap-[10px] mb-[32px]">
        <Button
          text="Unjudged"
          isSelected={selectedButton === 'Unjudged'}
          badgeCount={unscoredTeams?.length}
          onClick={() => setSelectedButton('Unjudged')}
        />
        <Button
          text="Scored"
          isSelected={selectedButton === 'Scored'}
          onClick={() => setSelectedButton('Scored')}
        />
      </div>

      <div className="px-[20px]">
        {loading ? (
          <Loader />
        ) : error ? (
          <div className="bg-red-100 p-4 rounded">
            <p className="text-red-800">{error}</p>
          </div>
        ) : selectedButton === 'Unjudged' ? (
          <UnscoredPage
            teams={unscoredTeams}
            revalidateData={() => fetchSubmissions()}
          />
        ) : (
          <ScoredPage teams={scoredTeams} />
        )}
      </div>
    </div>
  );
};

export default ProjectPage;
