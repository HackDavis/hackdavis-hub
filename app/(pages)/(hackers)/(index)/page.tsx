'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

import HackerHub from './_components/HackerHub/HackerHub';
import BigVinyl from './_components/BigVinyl/BigVinyl';
import LogoutAction from '@actions/auth/logout';

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
    <>
      <HackerHub />
      <form onSubmit={handleLogout}>
        <button type="submit" disabled={loading}>
          Sign Out
        </button>
      </form>
      <div className="h-[400px]">Spacer</div>
      <BigVinyl />
    </>
  );
}
