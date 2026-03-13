'use client';

import HubHero from './HubHero';
import TableLocations from './TableLocations';
import ViewProjects from './ViewProjects';
//import styles from './JudgingHub.module.scss';
import Waiting from './Waiting';
import PanelsAreLive from './PanelsAreLive';
// import Dismiss from './Dismiss';
import ClientTimeProtectedDisplay from '@pages/_components/TimeProtectedDisplay/ClientTimeProtectedDisplay';

export default function JudgingHub() {
  return (
    <div className="w-full display flex-col bg-[#FAFAFF] px-[22px] pt-[63px] pb-[43px] flex gap-[40px]">
      <ClientTimeProtectedDisplay featureId="view-projects">
        <ViewProjects />
      </ClientTimeProtectedDisplay>
      <ClientTimeProtectedDisplay featureId="panels-are-live">
        <PanelsAreLive />
      </ClientTimeProtectedDisplay>
      <HubHero />
      <Waiting />
      <TableLocations />
    </div>
  );
}
