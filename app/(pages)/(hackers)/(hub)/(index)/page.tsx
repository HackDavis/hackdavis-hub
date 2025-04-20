import Waterfall from '../../_components/Waterfall/Waterfall';
import BigVinyl from '../../_components/BigVinyl/BigVinyl';
import IndexHero from '../../_components/IndexHero/IndexHero';
// import UnderConstruction from '../../_components/UnderConstruction/UnderConstruction';
import PrizeTracks from '../../_components/PrizeTracks/PrizeTracks';
import BeginnersSection from '../../_components/BeginnersSection/BeginnersSection';
import Footer from '@components/Footer/Footer';
import TableNumberCheckin from '@pages/(hackers)/_components/TableNumberCheckin/TableNumberCheckin';
import TableNumberContextProvider from '@pages/_contexts/TableNumberContext';
import TimeProtectedDisplay from '@pages/_components/TimeProtectedDisplay/TimeProtectedDisplay';

export default function Page() {
  return (
    <main id="home">
      <TableNumberContextProvider>
        <IndexHero />
        <TableNumberCheckin />
      </TableNumberContextProvider>
      <BeginnersSection />
      {/* <UnderConstruction /> */}
      <PrizeTracks />
      <BigVinyl />
      <Waterfall />
      <Footer />
    </main>
  );
}
