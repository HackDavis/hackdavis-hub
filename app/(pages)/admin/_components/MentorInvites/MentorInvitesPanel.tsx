'use client';

import { useEffect, useState } from 'react';
import getRsvpLists from '@actions/tito/getRsvpLists';
import getReleases from '@actions/tito/getReleases';
import { Release, RsvpList } from '@typeDefs/tito';
import MentorSingleInviteForm from './MentorSingleInviteForm';
import MentorBulkInviteForm from './MentorBulkInviteForm';

type Mode = 'single' | 'bulk';

export default function MentorInvitesPanel() {
  const [mode, setMode] = useState<Mode>('single');
  const [rsvpLists, setRsvpLists] = useState<RsvpList[]>([]);
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    (async () => {
      const [rsvpRes, relRes] = await Promise.all([getRsvpLists(), getReleases()]);
      if (!rsvpRes.ok || !rsvpRes.body) {
        setLoadError(rsvpRes.error ?? 'Failed to load RSVP lists.');
      } else if (!relRes.ok || !relRes.body) {
        setLoadError(relRes.error ?? 'Failed to load releases.');
      } else {
        setRsvpLists(rsvpRes.body);
        setReleases(relRes.body);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <div className="w-4 h-4 border-2 border-[#005271] border-t-transparent rounded-full animate-spin" />
        Loading Tito configuration…
      </div>
    );
  }

  if (loadError) {
    return (
      <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
        {loadError}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Single / Bulk toggle */}
      <div className="flex gap-2">
        {(['single', 'bulk'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              mode === m
                ? 'bg-[#005271] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {m === 'single' ? 'Single Invite' : 'Bulk Invite (CSV)'}
          </button>
        ))}
      </div>

      {mode === 'single' ? (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-gray-500">
            Send a Tito invite to a single mentor by entering their details below.
          </p>
          <MentorSingleInviteForm rsvpLists={rsvpLists} releases={releases} />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-gray-500">
            Upload a CSV with columns{' '}
            <span className="font-mono bg-gray-100 px-1 rounded">
              First Name, Last Name, Email
            </span>{' '}
            to send Tito invites to multiple mentors at once.
          </p>
          <MentorBulkInviteForm rsvpLists={rsvpLists} releases={releases} />
        </div>
      )}
    </div>
  );
}
