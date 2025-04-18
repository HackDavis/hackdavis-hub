'use client';

import { useState } from 'react';
import Waterfall from '../../_components/Waterfall/Waterfall';
import BigVinyl from '../../_components/BigVinyl/BigVinyl';
import IndexHero from '../../_components/IndexHero/IndexHero';
// import UnderConstruction from '../../_components/UnderConstruction/UnderConstruction';
import PrizeTracks from '../../_components/PrizeTracks/PrizeTracks';
import BeginnersSection from '../../_components/BeginnersSection/BeginnersSection';
import Footer from '@components/Footer/Footer';
import Modal from '../../_components/Modal/Modal';

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <main id="home">
      <IndexHero />
      <BeginnersSection />
      {/* <UnderConstruction /> */}
      <PrizeTracks />
      <BigVinyl />
      <Waterfall />
      <Footer />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}
