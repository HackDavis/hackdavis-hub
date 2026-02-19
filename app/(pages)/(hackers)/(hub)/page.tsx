import Waterfall from '@pages/(hackers)/_components/Waterfall/Waterfall';
import BigVinyl from '@pages/(hackers)/_components/BigVinyl/BigVinyl';
import PrizeTracks from '@pages/(hackers)/_components/PrizeTracks/PrizeTracks';
import BeginnersSection from '@pages/(hackers)/_components/BeginnersSection/BeginnersSection';
import Footer from '@components/Footer/Footer';
import Contact from '@pages/(hackers)/_components/Contact/Contact';
import IndexHero from '@pages/(hackers)/_components/IndexHero/IndexHero';
import IndexHeroContentHacking from '@pages/(hackers)/_components/DOE/Hacking/IndexHeroContentHacking';
import IndexHeroContentJudging from '@pages/(hackers)/_components/DOE/Judging/IndexHeroContentJudging';
import ClientTimeProtectedDisplay from '@pages/_components/TimeProtectedDisplay/ClientTimeProtectedDisplay';
import TableNumberCheckin from '@pages/(hackers)/_components/TableNumberCheckin/TableNumberCheckin';
import TableNumberContextProvider from '@pages/_contexts/TableNumberContext';
import ScheduleSneakPeek from '@pages/(hackers)/_components/IndexHero/ScheduleSneakPeek';

export default function Page() {
  return (
    <main id="home">
      <TableNumberContextProvider>
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
      {/* so its visible underneath svgs. remove formatting later */}
      <div className="relative z-10 pt-[24vw] md:pt-[18vw]">
        <ScheduleSneakPeek />
      </div>
      <BeginnersSection />
      <Contact />
      <PrizeTracks />
      <BigVinyl />
      <Waterfall />
      <Footer />
    </main>
  );
}
