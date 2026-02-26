'use client';

import { FormEvent, useState } from 'react';
import sendSingleMentorInvite from '@actions/emails/sendSingleMentorInvite';
import { Release, RsvpList } from '@typeDefs/tito';

interface Props {
  rsvpLists: RsvpList[];
  releases: Release[];
}

export default function MentorSingleInviteForm({ rsvpLists, releases }: Props) {
  const [loading, setLoading] = useState(false);
  const [titoUrl, setTitoUrl] = useState('');
  const [error, setError] = useState('');
  const [selectedListSlug, setSelectedListSlug] = useState(rsvpLists[0]?.slug ?? '');
  const [selectedReleases, setSelectedReleases] = useState<string[]>([]);

  const toggleRelease = (id: string) =>
    setSelectedReleases((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedListSlug) {
      setError('Please select an RSVP list.');
      return;
    }
    if (selectedReleases.length === 0) {
      setError('Please select at least one release.');
      return;
    }

    setLoading(true);
    setTitoUrl('');
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await sendSingleMentorInvite({
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      rsvpListSlug: selectedListSlug,
      releaseIds: selectedReleases.join(','),
    });

    setLoading(false);

    if (result.ok) {
      setTitoUrl(result.titoUrl ?? '');
      (e.target as HTMLFormElement).reset();
      setSelectedReleases([]);
    } else {
      setError(result.error ?? 'An unexpected error occurred.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
      {/* Name + Email */}
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

      {/* RSVP List */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">RSVP List</label>
        <select
          value={selectedListSlug}
          onChange={(e) => setSelectedListSlug(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#005271]"
        >
          {rsvpLists.map((list) => (
            <option key={list.id} value={list.slug}>
              {list.title}
            </option>
          ))}
        </select>
      </div>

      {/* Releases */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Releases (ticket types)
          </label>
          <button
            type="button"
            onClick={() =>
              setSelectedReleases(
                selectedReleases.length === releases.length
                  ? []
                  : releases.map((r) => r.id)
              )
            }
            className="text-xs text-[#005271] underline"
          >
            {selectedReleases.length === releases.length ? 'Deselect all' : 'Select all'}
          </button>
        </div>
        <div className="flex flex-col gap-1">
          {releases.map((release) => (
            <label
              key={release.id}
              className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer text-sm"
            >
              <input
                type="checkbox"
                checked={selectedReleases.includes(release.id)}
                onChange={() => toggleRelease(release.id)}
                className="w-4 h-4 accent-[#005271]"
              />
              <span className="text-gray-800 font-medium">{release.title}</span>
              <span className="text-gray-400 text-xs ml-auto">{release.id}</span>
            </label>
          ))}
        </div>
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
      {titoUrl && (
        <div className="bg-green-50 border border-green-200 rounded-md px-3 py-2 flex flex-col gap-1">
          <p className="text-sm font-medium text-green-700">Invite sent!</p>
          <p className="text-xs text-green-600 break-all">{titoUrl}</p>
        </div>
      )}
    </form>
  );
}
