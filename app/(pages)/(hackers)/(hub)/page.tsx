import PrizeTracks from '@pages/(hackers)/_components/PrizeTracks/PrizeTracks';
import BeginnersSection from '@pages/(hackers)/_components/HomeHacking/BeginnersSection';
import Discord from '@pages/(hackers)/_components/StayUpToDate/Discord';
import Footer from '@components/Footer/Footer';
import HeroMVP from '../_components/HomeHacking/HeroMVP';
import ClientTimeProtectedDisplay from '@pages/_components/TimeProtectedDisplay/ClientTimeProtectedDisplay';
import TableNumberCheckin from '@pages/(hackers)/_components/TableNumberCheckin/TableNumberCheckin';
import TableNumberContextProvider from '@pages/_contexts/TableNumberContext';
import MDHelp from '@pages/(hackers)/_components/HomeHacking/MDHelp';
import ScheduleSneakPeek from '@pages/(hackers)/_components/HomeHacking/ScheduleSneakPeek';
import HeroJudging from '../_components/HomeJudging/HeroJudging';
import HackerChoiceAward from '../_components/HomeJudging/HackersChoiceAwards';
import HeroWaiting from '../_components/HomeJudging/HeroWaiting';

export default function Page() {
  return (
    <main id="home">
      <TableNumberContextProvider>
        <ClientTimeProtectedDisplay featureId="hero-hacking">
          <HeroMVP />
          <ScheduleSneakPeek />
          <BeginnersSection />
          <MDHelp />
        </ClientTimeProtectedDisplay>
        {/* temporarilty set featureId below to "hero-hacking" to test */}
        <ClientTimeProtectedDisplay featureId="hero-judging">
          <HeroWaiting />
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

      {/* this is last year's page structure for reference (temp) */}
      {/* <TableNumberContextProvider>
        <IndexHero>
          <ClientTimeProtectedDisplay featureId="hero-hacking">
            <IndexHeroContentHacking />
          </ClientTimeProtectedDisplay>
          <ClientTimeProtectedDisplay featureId="hero-judging">
            <IndexHeroContentJudging />
          </ClientTimeProtectedDisplay>
        </IndexHero>
        <ClientTimeProtectedDisplay featureId="table-number-checkin">
          <TableNumberCheckin />
        </ClientTimeProtectedDisplay>
      </TableNumberContextProvider>
      <BeginnersSection />
      <Contact />
      <PrizeTracks />
      <BigVinyl />
      <Waterfall />
      <Footer /> */}
    </main>
  );
}
