'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

import HackerHub from './_components/HackerHub/HackerHub';
import ProtectedDisplay from '@components/ProtectedDisplay/ProtectedDisplay';
import LogoutAction from '@actions/auth/logout';

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    const response = await LogoutAction();
    setLoading(false);

    if (response.ok) {
      router.push('/login');
    }
  };

  return (
    <ProtectedDisplay allowedRoles="hacker admin">
      <HackerHub />
      <form onSubmit={handleSubmit}>
        <button type="submit" disabled={loading}>
          Sign Out
        </button>
      </form>
    </ProtectedDisplay>
  );
}
