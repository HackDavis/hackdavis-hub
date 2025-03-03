'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

import Waterfall from '../_components/Waterfall/Waterfall';
import BigVinyl from '../_components/BigVinyl/BigVinyl';
import IndexHero from '../_components/IndexHero/IndexHero';
import UnderConstruction from '../_components/UnderConstruction/UnderConstruction';
import BeginnersSection from '../_components/BeginnersSection/BeginnersSection';
import LogoutAction from '@actions/auth/logout';
import Footer from '@components/Footer/Footer';

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    const response = await LogoutAction();
    setLoading(false);

    if (response.ok) {
      router.push('/login');
    }
  };

  return (
    <main>
      <form onSubmit={handleLogout}>
        <button type="submit" disabled={loading}>
          Sign Out
        </button>
      </form>
      <IndexHero />
      <BeginnersSection />
      <UnderConstruction />
      <BigVinyl />
      <Waterfall />
      <Footer />
    </main>
  );
}
