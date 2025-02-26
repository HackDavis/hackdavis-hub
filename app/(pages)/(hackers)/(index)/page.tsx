'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

import Waterfall from '../_components/Waterfall/Waterfall';
import BigVinyl from '../_components/BigVinyl/BigVinyl';
import IndexHero from '../_components/IndexHero/IndexHero';
import UnderConstruction from '../_components/UnderConstruction/UnderConstruction';
import LogoutAction from '@actions/auth/logout';
import Footer from '@app/(pages)/_components/Footer/Footer';

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
      <IndexHero />
      <UnderConstruction />
      <form onSubmit={handleLogout}>
        <button type="submit" disabled={loading}>
          Sign Out
        </button>
      </form>
      {/* Remove when adding vinyl or other components on top, just to see the whole flowers component */}
      <div className="h-[400px]">Spacer</div>
      <BigVinyl />
      <Waterfall />
      <Footer />
    </main>
  );
}
