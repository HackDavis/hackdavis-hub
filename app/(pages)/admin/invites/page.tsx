'use client';

import { useState } from 'react';
import MentorVolunteerInvitesPanel from '../_components/MentorVolunteerInvites/MentorVolunteerInvitesPanel';

type Tab = 'hackers' | 'judges' | 'mentors' | 'volunteers';

const TAB_LABELS: Record<Tab, string> = {
  hackers: 'Hackers',
  judges: 'Judges',
  mentors: 'Mentors',
  volunteers: 'Volunteers',
};

const TAB_DESCRIPTIONS: Record<Tab, string> = {
  hackers:
    'Send a Tito e-ticket and HackDavis Hub registration invite to hackers.',
  judges:
    'Send HackDavis Hub invites to judges. Navigate to emergency-invites for one-time links.',
  mentors: 'Send Tito e-ticket invites to mentors.',
  volunteers: 'Send Tito e-ticket invites to volunteers.',
};

export default function InvitesPage() {
  const [tab, setTab] = useState<Tab>('hackers');

  return (
    <div className="p-8 flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Invites</h1>

      {/* Tab bar */}
      <div className="flex gap-2 border-b border-gray-200">
        {(['hackers', 'judges', 'mentors', 'volunteers'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              tab === t
                ? 'border-[#005271] text-[#005271]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-[1.75rem] font-semibold">
          {TAB_LABELS[tab]} Invites
        </h2>
        <p className="text-sm text-gray-500">{TAB_DESCRIPTIONS[tab]}</p>
        <MentorVolunteerInvitesPanel
          role={
            tab === 'hackers'
              ? 'hacker'
              : tab === 'judges'
              ? 'judge'
              : tab === 'mentors'
              ? 'mentor'
              : 'volunteer'
          }
        />
      </div>
    </div>
  );
}
