'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

import Waterfall from './_components/Waterfall/Waterfall';
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
    <main>
      <form onSubmit={handleLogout}>
        <button type="submit" disabled={loading}>
          Sign Out
        </button>
      </form>
      {/* Remove when adding vinyl or other components on top, just to see the whole flowers component */}
      <div className="h-[400px]">Spacer</div>
      <Waterfall />
    </main>
  );
}
