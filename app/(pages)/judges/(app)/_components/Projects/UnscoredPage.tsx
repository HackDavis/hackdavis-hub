import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import ProjectTab from './ProjectTab';
import Team from '@typeDefs/team';
import { reportMissingProject } from '@actions/teams/reportMissingTeam';
import ReportModal from './ReportModal';
import EmptyState from './EmptyState';
import { FaChevronRight } from 'react-icons/fa6';

import venueMap from '@public/judges/projects/venueMap2026.svg';

interface UnscoredPageProps {
  teams: Team[];
  revalidateData: () => void;
}

export default function UnscoredPage({
  teams,
  revalidateData,
}: UnscoredPageProps) {
  const { data: session } = useSession();
  const user = session?.user;
  const judgeId = user?.id ?? '';
  const [expandReportButton, setExpandReportButton] = useState(false);
  const [mapExpanded, setMapExpanded] = useState(false);
  const [modalStage, setModalStage] = useState<
    'hidden' | 'loading' | 'success' | 'error'
  >('hidden');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (teams.length === 0) {
    return (
      <EmptyState
        title="You're Done!"
        subtitle={"You've judged all your projects.\n Thank you so much!"}
      />
    );
  }

  const currentTeam = teams[0];
  const upcomingTeams = teams.slice(1);

  const handleTeamReport = async (team: Team) => {
    setModalStage('loading');
    const reportRes = await reportMissingProject(judgeId, team._id ?? '');
    if (!reportRes.ok) {
      setErrorMsg((reportRes.error ?? '').slice(0, 100));
      setModalStage('error');
    } else {
      setErrorMsg(null);
      setModalStage('success');
      revalidateData();
    }
    setExpandReportButton(false);
  };

  return (
    <div className="flex flex-col bg-white rounded-[32px]">
      {/* Current Project header */}
      <div className="flex flex-col mt-[34px] mx-[30px] gap-[7px]">
        <p className="text-[24px] font-bold text-[#3F3F3F] mb-[6px]">
          Current Project
        </p>
        <p className="text-[16px] text-[#65E5E65] leading-snug">
          Projects must be judged in order one by one order.
        </p>
      </div>

      {/* CTA Button */}
      <Link
        href={`/judges/score/${currentTeam._id}`}
        className="h-[60px] bg-black rounded-full flex items-center justify-between px-[28px] mt-[16px] mx-[25px]"
      >
        <div className="flex items-centergap-[14px]">
          <span className="text-white font-bold text-[26px] leading-none">
            {currentTeam.tableNumber || currentTeam._id}
          </span>
          <span className="text-white font-semibold text-[18px]">
            {currentTeam.name || `Team ${currentTeam._id}`}
          </span>
        </div>
        <FaChevronRight className="text-white" size={18} />
      </Link>

      {/* Map card */}
      <div className="relative w-full mt-[36px] rounded-[20px] border-[1.5px] border-[#E0E0E0] overflow-visible mb-[4px]">
        <div className="flex p-[12px] rounded-[20px] overflow-hidden">
          <Image src={venueMap} alt="first floor map" />
        </div>
        <button
          onClick={() => setMapExpanded(true)}
          className="absolute bottom-[-26px] left-1/2 -translate-x-1/2 bg-black text-white rounded-full w-[52px] h-[52px] flex items-center justify-center z-10"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M3 8V3H8M12 3H17V8M17 12V17H12M8 17H3V12"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Flag section */}
      <div className="flex flex-col items-center gap-[16px] mt-[44px] mb-[32px]">
        <p className="text-[16px] text-[#6B6B6B] text-center leading-snug">
          If the team you are judging is not present, tap the{' '}
          <span className="text-[#F4847A] font-semibold">red button</span>{' '}
          below.
        </p>

        {expandReportButton ? (
          <div className="flex w-full gap-[10px]">
            <div className="flex-1 h-[56px] bg-[#F4847A] rounded-full flex items-center justify-center text-white font-semibold text-[15px]">
              Are you sure?
            </div>
            <button
              onClick={() => handleTeamReport(currentTeam)}
              className="flex-1 h-[56px] bg-[#F4847A] rounded-full text-white font-semibold text-[16px]"
            >
              Yes
            </button>
            <button
              onClick={() => setExpandReportButton(false)}
              className="flex-1 h-[56px] border-[1.5px] border-[#AAAAAA] rounded-full text-[#3D3D3D] font-semibold text-[16px]"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setExpandReportButton(true)}
            className="w-full h-[56px] bg-[#F4847A] rounded-full text-white font-semibold text-[18px]"
          >
            Flag team as missing
          </button>
        )}
      </div>

      {/* Next up */}
      {upcomingTeams.length > 0 && (
        <div className="flex flex-col mb-[58px]">
          <span className="text-[28px] font-bold text-black mb-[16px]">
            Next up
          </span>
          <div className="flex flex-col gap-[12px] opacity-50">
            {upcomingTeams.map((team) => (
              <ProjectTab key={team._id} team={team} disabled />
            ))}
          </div>
        </div>
      )}

      {/* Expanded Map Modal */}
      {mapExpanded && (
        <div
          className="bg-white rounded-[24px] overflow-y-auto relative"
          style={{ width: '349px', height: '831px' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="bg-white rounded-[24px] overflow-y-auto w-full max-w-[420px] max-h-[90vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-[16px] pt-[16px] pb-[8px]">
              <button
                onClick={() => setMapExpanded(false)}
                className="bg-black text-white rounded-full w-[36px] h-[36px] flex items-center justify-center text-lg font-bold"
              >
                <Image
                  src="@public/judges/projects/x.svg"
                  alt="Close"
                  width={15}
                  height={15}
                />
              </button>
            </div>

            <div className="flex flex-col gap-[12px] px-[16px] pb-[20px]">
              <Image src={venueMap} alt="first floor map" className="w-full" />
            </div>
          </div>
        </div>
      )}

      <ReportModal
        modalStage={modalStage}
        setModalStage={setModalStage}
        errorMsg={errorMsg}
      />
    </div>
  );
}
