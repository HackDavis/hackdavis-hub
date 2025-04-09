import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import ProjectTab from './ProjectTab';
import projectCow from '/public/judges/projects/project-cow.svg';
import { reportMissingProject } from '@actions/submissions/reportMissingProject';
import Team from '@typeDefs/team';
import styles from './UnscoredPage.module.scss';

interface UnscoredPageProps {
  teams: Team[];
  revalidateData: () => void; // Callback to refresh parent data
}

export default function UnscoredPage({
  teams,
  revalidateData,
}: UnscoredPageProps) {
  const { data: session } = useSession();
  const user = session?.user;
  const judgeId = user?.id ?? '';

  const [expandReportButton, setExpandReportButton] = useState(false);

  // If no submissions, show the completion message
  if (teams.length === 0) {
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

  const currentTeam = teams[0];
  const upcomingTeams = teams.slice(1);

  const reportMissingTeam = async (team: Team) => {};

  return (
    <div className="flex flex-col h-full bg-[#F2F2F7]">
      <span className="text-[32px] font-semibold text-[#000000] mb-[12px]">
        Current Project:
      </span>
      <span className={styles.instructions}>
        <p className={styles.dark}>
          Projects must be judged in order one by one order.
        </p>
        <p className={styles.grey}>
          If the team you are judging is not present, tap the{' '}
          <span className={styles.red}>red button</span> below.
        </p>
      </span>
      <Link
        href={`/judges/score/${currentTeam._id}`}
        className="flex items-center justify-center w-full py-[20px] bg-white rounded-[16px] gap-[16px] mb-[20px]"
      >
        <span className="text-[48px] text-[#000000] leading-[60px] font-[600]">
          {currentTeam.tableNumber || currentTeam._id}
        </span>
        <span className="text-[24px] text-[#000000] tracking-[0.48px] leading-[30px] font-[500]">
          {currentTeam.name || `Team ${currentTeam._id}`}
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
      </Link>
      <div className="flex h-[284px] bg-[#D9D9D9] rounded-[24px] mb-[20px]"></div>

      <div className={styles.report_container}>
        {expandReportButton ? (
          <>
            <div className={`${styles.buttons} ${styles.are_you_sure}`}>
              Are you sure
            </div>
            <div className={`${styles.buttons} ${styles.yes}`}>Yes</div>
            <div
              className={`${styles.buttons} ${styles.cancel}`}
              onClick={() => setExpandReportButton(false)}
            >
              Cancel
            </div>
          </>
        ) : (
          <div
            className={`${styles.flag_starter} ${styles.buttons}`}
            onClick={() => setExpandReportButton(true)}
          >
            Flag team as missing
          </div>
        )}
      </div>

      {upcomingTeams.length > 0 && (
        <>
          <span className="text-[32px] font-[600] tracking-[0.64px] text-[#000000] mb-[24px]">
            Next up:
          </span>
          <div className="flex flex-col gap-[16px] mb-[58px] opacity-50">
            {upcomingTeams.map((team) => (
              <ProjectTab key={team._id} team={team} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
