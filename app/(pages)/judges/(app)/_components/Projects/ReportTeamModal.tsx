import Image from 'next/image';
import Team from '@typeDefs/team';

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
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-28 pb-8">
      <div className="flex flex-col items-center relative bg-[#FAFAFF] rounded-[32px] w-[calc(100vw-40px)] overflow-hidden">
        {/* X button */}
        <button
          onClick={() => setExpandReportButton(false)}
          className="absolute top-[14px] right-4 z-10 bg-black text-white rounded-full w-[40px] h-[40px] flex items-center justify-center"
          aria-label="Close"
        >
          <Image src={closeIcon} alt="Close" width={14} height={14} />
        </button>

        {/* Image */}
        <div className="w-[320px] h-[250px] bg-[#E8F0F8] border-2 border-black">
          <Image src={missingTeams} alt="Missing Teams" />
        </div>

        {/* Content */}
        <div className="mt-4 px-6 pt-4 pb-[32px] flex flex-col gap-4">
          {/* Team pill */}
          <div className="bg-[#F3F3FC] rounded-full px-6 py-[8px] flex items-center justify-center gap-[8px]">
            <span className="text-[32px] font-semibold text-black">
              {currentTeam.tableNumber || currentTeam._id}
            </span>
            <span className="text-[18px] font-semibold text-black">
              {currentTeam.name || `Team ${currentTeam._id}`}
            </span>
          </div>

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
            className="w-full h-[56px] bg-[#FF8D8D] rounded-full text-white font-semibold text-[17px] flex items-center justify-center gap-[8px]"
          >
            Confirm missing team{' '}
            <Image src={whiteArrow} alt="White Arrow" width={24} height={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
