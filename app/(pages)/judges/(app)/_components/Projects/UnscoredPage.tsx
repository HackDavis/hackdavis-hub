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
import { IoExpandOutline } from 'react-icons/io5';

import venueMap from '@public/judges/projects/venueMap2026.svg';
import closeIcon from '@public/judges/projects/x.svg';

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
    <>
      <div className="flex flex-col">
        <div className="bg-white px-[30px] py-[34px] rounded-[32px]">
          {/* Current Project header */}
          <div className="flex flex-col gap-[7px]">
            <p className="text-[22px] font-semibold text-[#3F3F3F]">
              Current Project
            </p>
            <p className="text-[16px] text-[#5E5E65]">
              Projects must be judged in order one by one order.
            </p>
          </div>

          {/* To-score Project Button */}
          <Link
            href={`/judges/score/${currentTeam._id}`}
            className="bg-black rounded-[24px] flex items-center justify-between px-[24px] py-[12px] my-[16px]"
          >
            <div className="flex items-center gap-[14px]">
              <span className="text-white font-semibold text-[32px]">
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
              onClick={() => {
                setMapExpanded(true);
              }}
              className="absolute bottom-[-26px] left-1/2 -translate-x-1/2 bg-black text-white rounded-full w-[52px] h-[52px] flex items-center justify-center z-10"
            >
              <IoExpandOutline size={24} />
            </button>
          </div>

          {/* Flag section */}
          <div className="flex flex-col items-center gap-[14px] mt-[44px]">
            <p className="text-[16px] text-[#6B6B6B] text-center leading-snug">
              If the team you are judging is not present, tap the{' '}
              <span className="text-[#F4847A] font-semibold">red button</span>{' '}
              below.
            </p>

            {/* TODO: TURN INTO POPUP */}
            {expandReportButton ? (
              <>
                <div className="text-[#3F3F3F] font-semibold text-[22px] text-left">
                  Are you sure?
                </div>
                <div className="flex w-full gap-[10px]">
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
              </>
            ) : (
              <button
                onClick={() => setExpandReportButton(true)}
                className="w-full h-[56px] bg-[#F4847A] rounded-full text-white font-semibold text-[18px]"
              >
                Flag team as missing
              </button>
            )}
          </div>
        </div>

        {/* Next up */}
        {upcomingTeams.length > 0 && (
          <div className="flex flex-col mt-[32px] gap-[24px]">
            <span className="text-[22px] font-semibold text-black">
              Next up
            </span>
            <div className="flex flex-col gap-[24px]">
              {upcomingTeams.map((team) => (
                <ProjectTab key={team._id} team={team} disabled />
              ))}
            </div>
          </div>
        )}

        {/* Expanded Map Modal */}
        {mapExpanded && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-[22px] py-[48px]"
            onClick={() => setMapExpanded(false)}
          >
            <div
              className="bg-white rounded-[24px] overflow-hidden w-full max-w-[430px] h-[calc(100dvh-96px)] relative flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setMapExpanded(false)}
                className="absolute top-[16px] right-[16px] z-10 bg-black text-white rounded-full w-[36px] h-[36px] flex items-center justify-center text-lg font-bold"
                aria-label="Close map"
              >
                <Image src={closeIcon} alt="Close" width={15} height={15} />
              </button>

              <div className="h-full w-full overflow-auto px-[16px] py-[16px]">
                <div className="flex h-full min-w-full items-center justify-center rotate-90 m-[150px]">
                  <Image
                    src={venueMap}
                    alt="first floor map"
                    className="h-full w-auto max-w-none select-none"
                  />
                </div>
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
    </>
  );
}
