'use client';

import { useState } from 'react';
import JudgeSingleInviteForm from '../_components/JudgeInvites/JudgeSingleInviteForm';
import JudgeBulkInviteForm from '../_components/JudgeInvites/JudgeBulkInviteForm';
import MentorInvitesPanel from '../_components/MentorInvites/MentorInvitesPanel';

type Tab = 'judges' | 'mentors';

export default function InvitesPage() {
  const [tab, setTab] = useState<Tab>('judges');

  return (
    <div className="p-8 flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Invites</h1>

      {/* Tab bar */}
      <div className="flex gap-2 border-b border-gray-200">
        {(['judges', 'mentors'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              tab === t
                ? 'border-[#005271] text-[#005271]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'judges' ? 'Judges' : 'Mentors'}
          </button>
        ))}
      </div>

      {/* Judges panel */}
      {tab === 'judges' && (
        <div className="flex flex-col gap-6">
          <section className="flex flex-col gap-3">
            <h2 className="text-[1.75rem] font-semibold">Invite a Judge</h2>
            <p className="text-sm text-gray-500">
              Send a HackDavis Hub invite to a single judge by entering their
              details below.
            </p>
            <JudgeSingleInviteForm />
          </section>

          <hr />

          <section className="flex flex-col gap-3">
            <h2 className="text-[1.75rem] font-semibold">Bulk Invite Judges</h2>
            <p className="text-sm text-gray-500">
              Upload a CSV with columns{' '}
              <span className="font-mono bg-gray-100 px-1 rounded">
                First Name, Last Name, Email
              </span>{' '}
              to send Hub invites to multiple judges at once.
            </p>
            <JudgeBulkInviteForm />
          </section>
        </div>
      )}

      {/* Mentors panel */}
      {tab === 'mentors' && (
        <div className="flex flex-col gap-3">
          <h2 className="text-[1.75rem] font-semibold">Mentor Invites</h2>
          <MentorInvitesPanel />
        </div>
      )}
    </div>
  );
}
