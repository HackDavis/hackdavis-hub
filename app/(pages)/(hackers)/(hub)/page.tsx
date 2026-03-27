'use client';

import PrizeTracks from '@pages/(hackers)/_components/PrizeTracks/PrizeTracks';
import BeginnersSection from '@pages/(hackers)/_components/HomeHacking/BeginnersSection';
import Discord from '@pages/(hackers)/_components/StayUpToDate/Discord';
import Footer from '@components/Footer/Footer';
import ClientTimeProtectedDisplay from '@pages/_components/TimeProtectedDisplay/ClientTimeProtectedDisplay';
import TableNumberCheckin from '@pages/(hackers)/_components/TableNumberCheckin/TableNumberCheckin';
import TableNumberContextProvider from '@pages/_contexts/TableNumberContext';
import MDHelp from '@pages/(hackers)/_components/HomeHacking/MDHelp';
import ScheduleSneakPeek from '@pages/(hackers)/_components/HomeHacking/ScheduleSneakPeek';
import HeroJudging from '../_components/HomeJudging/HeroJudging';
import HackerChoiceAward from '../_components/HomeJudging/HackersChoiceAwards';
import HeroHacking from '../_components/HomeHacking/HeroHacking';
import { useRollout } from '@pages/_hooks/useRollout';

export default function Page() {
  const { rolloutRes, loading } = useRollout('hacking-starts');
  const rolloutTime = rolloutRes?.ok
    ? rolloutRes.body?.rollout_time
    : undefined;

  return (
    <main id="home">
      <TableNumberContextProvider>
        <ClientTimeProtectedDisplay featureId="hero-judging">
          <HeroHacking rolloutTime={rolloutTime} loading={loading} />
          <ScheduleSneakPeek />
          <BeginnersSection />
          <MDHelp />
        </ClientTimeProtectedDisplay>
        {/* temporarilty set featureId below to "hero-hacking" to test */}
        <ClientTimeProtectedDisplay featureId="hero-hacking">
          <HeroJudging />
          <HackerChoiceAward />
        </ClientTimeProtectedDisplay>
        <ClientTimeProtectedDisplay featureId="table-number-checkin">
          <TableNumberCheckin />
        </ClientTimeProtectedDisplay>
      </TableNumberContextProvider>
      <Discord />
      <PrizeTracks />
      <Footer />
    </main>
  );
}
