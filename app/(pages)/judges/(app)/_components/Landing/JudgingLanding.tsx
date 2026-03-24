'use client';

import JudgeHero from './JudgeHero';
import Questions from './Questions';
import ViewProjects from './ViewProjects';
import Waiting from './Waiting';
import PanelsAreLive from './PanelsAreLive';
import ClientTimeProtectedDisplay from '@pages/_components/TimeProtectedDisplay/ClientTimeProtectedDisplay';

export default function JudgingLanding() {
  return (
    <div className="w-full display flex-col bg-[#FAFAFF] px-[22px] pt-[63px] pb-[43px] flex gap-[40px]">
      <ClientTimeProtectedDisplay featureId="view-projects">
        <ViewProjects />
      </ClientTimeProtectedDisplay>
      <ClientTimeProtectedDisplay featureId="panels-are-live">
        <PanelsAreLive />
      </ClientTimeProtectedDisplay>
      <JudgeHero />
      <Waiting />
      <Questions />
    </div>
  );
}
