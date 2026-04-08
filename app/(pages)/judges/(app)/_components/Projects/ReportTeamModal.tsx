import Image from 'next/image';
import Team from '@typeDefs/team';
import ProjectTab from './ProjectTab';

import closeIcon from '@public/judges/projects/x.svg';
import missingTeams from '@public/judges/projects/missingTeams.svg';
import whiteArrow from '@public/judges/projects/whiteArrow.svg';

type ModalStage = 'hidden' | 'loading' | 'success' | 'error';

export default function ReportTeamModal({
  currentTeam,
  setExpandReportButton,
  handleTeamReport,
  modalStage,
  setModalStage,
  errorMsg,
}: {
  currentTeam: Team;
  setExpandReportButton: (expand: boolean) => void;
  handleTeamReport: (team: Team) => void | Promise<void>;
  modalStage: ModalStage;
  setModalStage: React.Dispatch<React.SetStateAction<ModalStage>>;
  errorMsg: string | null;
}) {
  const isLoading = modalStage === 'loading';
  const isError = modalStage === 'error';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-[15px]">
      <div className="relative flex w-full min-w-[370px] max-w-[500px] flex-col items-center overflow-hidden rounded-[20px] bg-[#FAFAFF] px-[15px]">
        {/* X button */}
        <button
          onClick={() => {
            setModalStage('hidden');
            setExpandReportButton(false);
          }}
          className="absolute right-4 top-[14px] z-10 flex h-[40px] w-[40px] items-center justify-center rounded-full bg-black text-white"
          aria-label="Close"
        >
          <Image src={closeIcon} alt="Close" width={14} height={14} />
        </button>

        {/* Image */}
        <div className="h-[250px] w-[320px]">
          <Image src={missingTeams} alt="Missing Teams" />
        </div>

        {/* Content */}
        <div className="mt-4 flex flex-col gap-4 px-6 pb-[32px]">
          {/* Team pill */}
          <ProjectTab key={currentTeam._id} team={currentTeam} disabled />

          {/* Confirmation text */}
          <div>
            <p className="text-[18px] font-semibold text-[#3F3F3F]">
              Are you sure this team is
              <span className="text-[#FF8D8D]"> missing</span>?
            </p>
            <p className="mt-[4px] text-[18px] text-[#878796]">
              By flagging this team as missing, it will be placed in the Missing
              Teams section of your dashboard.
            </p>
          </div>

          {/* Confirm button */}
          <button
            onClick={() => handleTeamReport(currentTeam)}
            disabled={isLoading}
            className="flex h-[56px] w-full items-center justify-center gap-[8px] rounded-full bg-[#FF8D8D] text-[16px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <span className="h-[18px] w-[18px] animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Reporting...
              </>
            ) : (
              <>
                {isError ? 'Try again' : 'Confirm missing team'}{' '}
                <Image
                  src={whiteArrow}
                  alt="White Arrow"
                  width={24}
                  height={24}
                />
              </>
            )}
          </button>

          {isError && errorMsg && (
            <p className="text-center text-[14px] text-[#D45858]">{errorMsg}</p>
          )}
        </div>
      </div>
    </div>
  );
}
