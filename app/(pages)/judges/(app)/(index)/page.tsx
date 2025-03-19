'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

import LogoutAction from '@actions/auth/logout';
import JudgingHub from './_components/JudgingHub/JudgingHub';

export default function Judges() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    const response = await LogoutAction();
    setLoading(false);

    if (response.ok) {
      router.push('/judges/login');
    }
  };

  return (
    <>
      <form onSubmit={handleLogout}>
        <button type="submit" disabled={loading}>
          Sign Out
        </button>
      </form>
      <JudgingHub />
    </>
  );
}
