import PrizeTracks from '@pages/(hackers)/_components/PrizeTracks/PrizeTracks';
import BeginnersSection from '@pages/(hackers)/_components/BeginnersSection/BeginnersSection';
import Discord from '@pages/(hackers)/_components/StayUpToDate/Discord';
import Footer from '@components/Footer/Footer';
import Hero from '../_components/Hero/Hero';
// import IndexHero from '@pages/(hackers)/_components/IndexHero/IndexHero';
// import IndexHeroContentHacking from '@pages/(hackers)/_components/DOE/Hacking/IndexHeroContentHacking';
// import IndexHeroContentJudging from '@pages/(hackers)/_components/DOE/Judging/IndexHeroContentJudging';
import ClientTimeProtectedDisplay from '@pages/_components/TimeProtectedDisplay/ClientTimeProtectedDisplay';
import TableNumberCheckin from '@pages/(hackers)/_components/TableNumberCheckin/TableNumberCheckin';
import TableNumberContextProvider from '@pages/_contexts/TableNumberContext';
import MDHelp from '@pages/(hackers)/_components/MentorAndDirectorHelp/MDHelp';

export default function Page() {
  return (
    <main id="home">
      <TableNumberContextProvider>
        <Hero />
        {/* <IndexHero>
          <ClientTimeProtectedDisplay featureId="hero-hacking">
            <IndexHeroContentHacking />
          </ClientTimeProtectedDisplay>
          <ClientTimeProtectedDisplay featureId="hero-judging">
            <IndexHeroContentJudging />
          </ClientTimeProtectedDisplay>
        </IndexHero> */}
        <ClientTimeProtectedDisplay featureId="table-number-checkin">
          <TableNumberCheckin />
        </ClientTimeProtectedDisplay>
      </TableNumberContextProvider>
      <BeginnersSection />
      {/* <Contact /> */}
      <MDHelp />
      <PrizeTracks />
      <Footer />
    </main>
  );
}
