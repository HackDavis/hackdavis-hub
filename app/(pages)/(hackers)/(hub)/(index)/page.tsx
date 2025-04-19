import Waterfall from '../../_components/Waterfall/Waterfall';
import BigVinyl from '../../_components/BigVinyl/BigVinyl';
import PrizeTracks from '../../_components/PrizeTracks/PrizeTracks';
import BeginnersSection from '../../_components/BeginnersSection/BeginnersSection';
import Footer from '@components/Footer/Footer';
import Contact from '@pages/(hackers)/_components/Contact/Contact';
// import IndexHeroDone from '@pages/(hackers)/_components/IndexHero/IndexHeroDone';
// import IndexHeroHacking from '@pages/(hackers)/_components/DOE/Hacking/IndexHeroHacking';
// import TimeProtectedDisplay from '@pages/_components/TimeProtectedDisplay/TimeProtectedDisplay';
import IndexHeroJudging from '@pages/(hackers)/_components/DOE/Judging/IndexHeroJudging';

export default function Page() {
  return (
    <main id="home">
      <IndexHeroJudging />
      {/* <IndexHeroDone /> */}
      <BeginnersSection />
      <Contact />
      <PrizeTracks />
      <BigVinyl />
      <Waterfall />
      <Footer />
    </main>
  );
}
