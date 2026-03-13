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
    <div className="flex flex-col justify-center items-center bg-[#FAFAFF] pb-[43px]">
      <JudgingHub />
      <form onSubmit={handleLogout} className="flex flex-col justify-center">
        <button
          type="submit"
          disabled={loading}
          className="mt-[20px] bg-[#FF8D8D] text-white rounded-[20px] py-[15px] w-[342px]"
        >
          Sign Out
        </button>
      </form>
    </div>
  );
}
