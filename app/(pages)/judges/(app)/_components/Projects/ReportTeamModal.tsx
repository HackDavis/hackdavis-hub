import Image from 'next/image';
import Team from '@typeDefs/team';
import ProjectTab from './ProjectTab';

import closeIcon from '@public/judges/projects/x.svg';
import missingTeams from '@public/judges/projects/missingTeams.svg';
import whiteArrow from '@public/judges/projects/whiteArrow.svg';

export default function ReportTeamModal({
  currentTeam,
  setExpandReportButton,
  handleTeamReport,
}: {
  currentTeam: Team;
  setExpandReportButton: (expand: boolean) => void;
  handleTeamReport: (team: Team) => void | Promise<void>;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="relative flex w-full min-w-[370px] max-w-[500px] flex-col items-center overflow-hidden rounded-[20px] bg-[#FAFAFF] px-[15px]">
        {/* X button */}
        <button
          onClick={() => setExpandReportButton(false)}
          className="absolute top-[14px] right-4 z-10 bg-black text-white rounded-full w-[40px] h-[40px] flex items-center justify-center"
          aria-label="Close"
        >
          <Image src={closeIcon} alt="Close" width={14} height={14} />
        </button>

        {/* Image */}
        <div className="w-[320px] h-[250px]">
          <Image src={missingTeams} alt="Missing Teams" />
        </div>

        {/* Content */}
        <div className="mt-4 px-6 pb-[32px] flex flex-col gap-4">
          {/* Team pill */}
          <ProjectTab key={currentTeam._id} team={currentTeam} disabled />

          {/* Confirmation text */}
          <div>
            <p className="text-[18px] font-semibold text-[#3F3F3F]">
              Are you sure this team is
              <span className="text-[#FF8D8D]"> missing</span>?
            </p>
            <p className="text-[18px] text-[#878796] mt-[4px]">
              By flagging this team as missing, it will be placed in the Missing
              Teams section of your dashboard.
            </p>
          </div>

          {/* Confirm button */}
          <button
            onClick={() => handleTeamReport(currentTeam)}
            className="w-full h-[56px] bg-[#FF8D8D] rounded-full text-white font-semibold text-[16px] flex items-center justify-center gap-[8px]"
          >
            Confirm missing team{' '}
            <Image src={whiteArrow} alt="White Arrow" width={24} height={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
