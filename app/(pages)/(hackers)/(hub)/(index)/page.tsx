'use client';

import { useState, useEffect } from 'react';
import Waterfall from '../../_components/Waterfall/Waterfall';
import BigVinyl from '../../_components/BigVinyl/BigVinyl';
import IndexHero from '../../_components/IndexHero/IndexHero';
// import UnderConstruction from '../../_components/UnderConstruction/UnderConstruction';
import PrizeTracks from '../../_components/PrizeTracks/PrizeTracks';
import BeginnersSection from '../../_components/BeginnersSection/BeginnersSection';
import Footer from '@components/Footer/Footer';
import Modal from '../../_components/Modal/Modal';

// Hackathon end date from the Countdown component
const COUNTDOWN_TARGET = new Date('2025-04-20T11:00:00-07:00');
const MODAL_COMPLETED_KEY = 'hackdavis-modal-completed';

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const hasCompletedModal =
      localStorage.getItem(MODAL_COMPLETED_KEY) === 'true';

    if (!hasCompletedModal) {
      const checkCountdown = () => {
        const now = new Date().getTime();
        const targetTime = COUNTDOWN_TARGET.getTime();
        const difference = targetTime - now;

        setIsModalOpen(difference <= 0);
      };

      checkCountdown();

      const timer = setInterval(checkCountdown, 10000);
      return () => clearInterval(timer);
    }
  }, []);

  return (
    <main id="home">
      <IndexHero />
      <BeginnersSection />
      {/* <UnderConstruction /> */}
      <PrizeTracks />
      <BigVinyl />
      <Waterfall />
      <Footer />

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
    </main>
  );
}
