'use client';

import LoginAction from '@actions/auth/login';
import { useRouter } from 'next/navigation';
import { FormEvent } from 'react';

export default function Form() {
  const router = useRouter();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const response = await LoginAction(
      formData.get('email'),
      formData.get('password')
    );

    if (response.ok) {
      router.push('/');
      router.refresh();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 mx-auto max-w-md mt-10"
    >
      <input
        name="email"
        type="email"
        className="border border-black text-black"
      />
      <input
        name="password"
        type="password"
        className="border border-black text-black"
      />
      <button type="submit">Login</button>
    </form>
  );
}
