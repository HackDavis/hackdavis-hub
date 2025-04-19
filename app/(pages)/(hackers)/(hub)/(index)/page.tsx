import Waterfall from '../../_components/Waterfall/Waterfall';
import BigVinyl from '../../_components/BigVinyl/BigVinyl';
import PrizeTracks from '../../_components/PrizeTracks/PrizeTracks';
import BeginnersSection from '../../_components/BeginnersSection/BeginnersSection';
import Footer from '@components/Footer/Footer';
import Contact from '@pages/(hackers)/_components/Contact/Contact';
// import IndexHeroDone from '@pages/(hackers)/_components/IndexHero/IndexHeroDone';
// import IndexHeroJudging from '@pages/(hackers)/_components/DOE/Judging/IndexHeroJudging';
import IndexHeroHacking from '@pages/(hackers)/_components/DOE/Hacking/IndexHeroHacking';

export default function Page() {
  return (
    <main id="home">
      {/* <IndexHeroJudging /> */}
      {/* <IndexHeroDone /> */}
      <IndexHeroHacking />
      <BeginnersSection />
      <Contact />
      <PrizeTracks />
      <BigVinyl />
      <Waterfall />
      <Footer />
    </main>
  );
}
