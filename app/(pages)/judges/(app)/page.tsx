'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

import LogoutAction from '@actions/auth/logout';
import JudgingLanding from './_components/Landing/JudgingLanding';

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
    <div className="flex flex-col justify-center items-center bg-[#FAFAFF]">
      <JudgingLanding />
      <form onSubmit={handleLogout} className="w-full">
        <button
          type="submit"
          disabled={loading}
          className="bg-[#FF8D8D] text-white text-[18px] font-bold rounded-[20px] py-[15px] mb-[43px] mx-[22px] w-[calc(100%-44px)]"
        >
          Sign Out
        </button>
      </form>
    </div>
  );
}
