'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { FaChevronLeft } from 'react-icons/fa6';
import { useJudgeSubmissions } from '@pages/_hooks/useJudgeSubmissions';
import UnscoredPage from './UnscoredPage';
import ScoredPage from './ScoredPage';
import Link from 'next/link';

interface ButtonProps {
  text: string;
  isSelected: boolean;
  width: string;
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({
  text,
  isSelected,
  width,
  onClick,
}) => (
  <button
    className={`${width} h-[42px] border-[1.5px] border-[#005271] border-solid rounded-[20px] text-[#005271] text-lg font-semibold tracking-[0.36px] flex items-center justify-center ${
      isSelected ? 'bg-[#9EE7E5]' : 'bg-white'
    }`}
    onClick={onClick}
  >
    {text}
  </button>
);

const ProjectPage = () => {
  const [selectedButton, setSelectedButton] = useState<'Unjudged' | 'Scored'>(
    'Unjudged'
  );
  const { data: session } = useSession();
  const user = session?.user;
  const userId = user?.id ?? '';

  const { scoredTeams, unscoredTeams, loading, error, updateSubmissions } =
    useJudgeSubmissions(userId);

  if (loading) {
    return 'loading...';
  }

  if (error) {
    return error;
  }

  return (
    <div className="flex flex-col h-full bg-[#F2F2F7]">
      <Link
        href="/judges"
        className="flex items-center ml-[20px] gap-[12px] mt-[59px]"
      >
        <FaChevronLeft fill="#005271" height={8.48} width={4.24} />
        <span className="font-semibold text-[18px] tracking-[0.36px] text-[#005271] leading-[100%]">
          Back to home
        </span>
      </Link>
      <div className="flex flex-col px-[20px] mt-[24px]">
        <span className="font-bold text-[48px] tracking-[0.96px] text-[#000000] ">
          Project
        </span>
      </div>
      <div className="flex px-[20px] space-x-[8px] mb-[32px]">
        <Button
          text="Unjudged"
          isSelected={selectedButton === 'Unjudged'}
          width="w-[136px]"
          onClick={() => setSelectedButton('Unjudged')}
        />
        <Button
          text="Scored"
          isSelected={selectedButton === 'Scored'}
          width="w-[114px]"
          onClick={() => setSelectedButton('Scored')}
        />
      </div>
      <div className="px-[20px]">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <p>Loading submissions...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 p-4 rounded">
            <p className="text-red-800">{error}</p>
          </div>
        ) : selectedButton === 'Unjudged' ? (
          <UnscoredPage
            teams={unscoredTeams}
            revalidateData={() => updateSubmissions(userId)}
          />
        ) : (
          <ScoredPage teams={scoredTeams} />
        )}
      </div>
    </div>
  );
};

export default ProjectPage;
