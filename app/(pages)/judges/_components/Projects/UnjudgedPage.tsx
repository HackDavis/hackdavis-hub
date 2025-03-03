import React, { useState } from 'react';
import ProjectTab from './ProjectTab';
import Image from 'next/image';
import projectCow from '/public/judges/projects/project-cow.svg';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { reportMissingProject } from '@actions/submissions/reportMissingProject';

interface Team {
  _id: string;
  teamNumber: number;
  tableNumber: number;
  name: string;
  tracks: string[];
  active: boolean;
}

interface Submission {
  _id: string;
  judge_id: string;
  team_id: string | number;
  social_good?: number;
  creativity?: number;
  presentation?: number;
  scores?: any[];
  comments?: string;
  queuePosition: number;
  is_scored: boolean;
  team?: Team;
}

interface UnjudgedPageProps {
  submissions: Submission[];
  onSubmissionsChange?: () => void; // Callback to refresh parent data
}

const UnjudgedPage: React.FC<UnjudgedPageProps> = ({
  submissions,
  onSubmissionsChange,
}) => {
  const { data: session } = useSession();
  const [isReporting, setIsReporting] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  // Sort submissions by queuePosition
  const sortedSubmissions = [...submissions].sort(
    (a, b) => a.queuePosition - b.queuePosition
  );

  // If no submissions, show the completion message
  if (sortedSubmissions.length === 0) {
    return (
      <div className="flex mt-[65px] flex-col items-center h-[calc(100vh-100px)] bg-[#F2F2F7]">
        <span className="text-[32px] font-[700] text-[#000000] mb-[12px]">
          You're Done!
        </span>
        <span className="text-[16px] font-[500] text-[#000000]">
          You've judged all your projects.
        </span>
        <span className="text-[16px] font-[500] text-[#000000] mb-[32px]">
          Thank you so much!
        </span>
        <Image src={projectCow} alt="Project Cow" />
      </div>
    );
  }

  // Get the current project (first in queue)
  const currentProject = sortedSubmissions[0];

  // Get the next projects
  const nextProjects = sortedSubmissions.slice(1);

  const handleReportMissing = async () => {
    if (!session?.user?.id || !currentProject.team_id) return;

    try {
      setIsReporting(true);
      setReportError(null);

      const judgeId = session.user.id.toString();
      const teamId = currentProject.team_id.toString();
      const currentPosition = currentProject.queuePosition;

      const result = await reportMissingProject(
        judgeId,
        teamId,
        currentPosition
      );

      if (!result.ok) {
        setReportError(result.error || 'Failed to report missing project');
        return;
      }

      // Refresh the parent component's data
      if (onSubmissionsChange) {
        onSubmissionsChange();
      }
    } catch (error) {
      setReportError(
        error instanceof Error ? error.message : 'An unknown error occurred'
      );
    } finally {
      setIsReporting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F2F2F7]">
      <span className="text-[32px] font-semibold text-[#000000] mb-[12px]">
        Current Project:
      </span>
      <span className="mb-[24px] text-[18px] font-normal text-[#000000] tracking-[0.36px] leading-[26.1px]">
        Projects must be judged in order one by one order.
      </span>
      <div className="flex items-center justify-center w-full py-[20px] bg-white rounded-[16px] gap-[16px] mb-[20px]">
        <span className="text-[48px] text-[#000000] leading-[60px] font-[600]">
          {currentProject.team?.tableNumber || currentProject.team_id}
        </span>
        <span className="text-[24px] text-[#000000] tracking-[0.48px] leading-[30px] font-[500]">
          {currentProject.team?.name || `Team ${currentProject.team_id}`}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15.4882 11.3215C14.8373 11.9724 14.8373 13.0276 15.4882 13.6785L21.8096 19.9999L15.4882 26.3215C14.8373 26.9724 14.8373 28.0276 15.4882 28.6785C16.139 29.3294 17.1943 29.3294 17.8452 28.6785L25.3452 21.1784C25.6577 20.8659 25.8333 20.442 25.8333 19.9999C25.8333 19.5579 25.6577 19.134 25.3452 18.8214L17.8452 11.3215C17.1943 10.6706 16.139 10.6706 15.4882 11.3215Z"
            fill="#333333"
          />
        </svg>
      </div>
      <div className="flex h-[284px] bg-[#D9D9D9] rounded-[24px] mb-[20px]"></div>
      <Link href={`/judges/project/${currentProject._id}`} passHref>
        <button className="bg-[#005271] text-white rounded-[8px] py-[15px] text-[18px] font-[600] tracking-[0.36px] leading-[18px] mb-[32px] w-full">
          View Project
        </button>
      </Link>

      {reportError && (
        <div className="bg-red-100 p-4 rounded mb-4">
          <p className="text-red-800">{reportError}</p>
        </div>
      )}

      <button
        className="bg-[#fa4e48] text-white rounded-[8px] py-[15px] text-[18px] font-[600] tracking-[0.36px] leading-[18px] mb-[32px] w-full"
        onClick={handleReportMissing}
        disabled={isReporting}
      >
        {isReporting ? 'Processing...' : 'Report Missing Project'}
      </button>

      {nextProjects.length > 0 && (
        <>
          <span className="text-[32px] font-[600] tracking-[0.64px] text-[#000000] mb-[24px]">
            Next up:
          </span>
          <div className="flex flex-col gap-[16px] mb-[58px] opacity-50">
            {nextProjects.map((project) => (
              <ProjectTab
                key={project._id}
                number={project.team?.tableNumber || project.team_id}
                name={project.team?.name || `Team ${project.team_id}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default UnjudgedPage;
