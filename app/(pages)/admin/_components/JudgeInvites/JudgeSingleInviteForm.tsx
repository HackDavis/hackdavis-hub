'use client';

import { FormEvent, useState } from 'react';
import sendSingleJudgeHubInvite from '@actions/emails/sendSingleJudgeHubInvite';

export default function JudgeSingleInviteForm() {
  const [loading, setLoading] = useState(false);
  const [inviteUrl, setInviteUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setInviteUrl('');
    setError('');

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;

    const result = await sendSingleJudgeHubInvite({ firstName, lastName, email });

    setLoading(false);

    if (result.ok) {
      setInviteUrl(result.inviteUrl ?? '');
      (e.target as HTMLFormElement).reset();
    } else {
      setError(result.error ?? 'An unexpected error occurred.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
      <div className="flex gap-4">
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-sm font-medium text-gray-700">First Name</label>
          <input
            name="firstName"
            type="text"
            required
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#005271]"
          />
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-sm font-medium text-gray-700">Last Name</label>
          <input
            name="lastName"
            type="text"
            required
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#005271]"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Email</label>
        <input
          name="email"
          type="email"
          required
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#005271]"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-[#005271] text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-[#003d54] disabled:opacity-50 disabled:cursor-not-allowed transition-colors self-start"
      >
        {loading ? 'Sending…' : 'Send Invite'}
      </button>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </p>
      )}
      {inviteUrl && (
        <div className="bg-green-50 border border-green-200 rounded-md px-3 py-2">
          <p className="text-sm font-medium text-green-700 mb-1">Invite sent!</p>
          <p className="text-xs text-green-600 break-all">{inviteUrl}</p>
        </div>
      )}
    </form>
  );
}
