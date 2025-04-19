import Waterfall from '../../_components/Waterfall/Waterfall';
import BigVinyl from '../../_components/BigVinyl/BigVinyl';
import PrizeTracks from '../../_components/PrizeTracks/PrizeTracks';
import BeginnersSection from '../../_components/BeginnersSection/BeginnersSection';
import Footer from '@components/Footer/Footer';
import Contact from '@pages/(hackers)/_components/Contact/Contact';
import IndexHero from '@pages/(hackers)/_components/IndexHero/IndexHero';
import IndexHeroContentHacking from '@pages/(hackers)/_components/DOE/Hacking/IndexHeroContentHacking';
import IndexHeroContentJudging from '@pages/(hackers)/_components/DOE/Judging/IndexHeroContentJudging';
import IndexHeroContentDone from '@pages/(hackers)/_components/IndexHero/IndexHeroContentDone';
import TimeProtectedDisplay from '@pages/_components/TimeProtectedDisplay/TimeProtectedDisplay';

export default function Page() {
  return (
    <main id="home">
      <IndexHero>
        <TimeProtectedDisplay featureId="hero-hacking">
          <IndexHeroContentHacking />
        </TimeProtectedDisplay>
        <TimeProtectedDisplay featureId="hero-judging">
          <IndexHeroContentJudging />
        </TimeProtectedDisplay>
        <TimeProtectedDisplay featureId="hero-done">
          <IndexHeroContentDone />
        </TimeProtectedDisplay>
      </IndexHero>

      <BeginnersSection />
      <Contact />
      <PrizeTracks />
      <BigVinyl />
      <Waterfall />
      <Footer />
    </main>
  );
}
