'use client';

import { FormEvent, useState } from 'react';
import sendSingleMentorOrVolunteerInvite from '@actions/emails/sendSingleMentorOrVolunteerInvite';
import sendSingleHackerInvite from '@actions/emails/sendSingleHackerInvite';
import sendSingleJudgeHubInvite from '@actions/emails/sendSingleJudgeHubInvite';
import { Release, RsvpList } from '@typeDefs/tito';
import {
  HackerAdmissionType,
  HACKER_ADMISSION_TYPES,
  HACKER_ADMISSION_LABELS,
  admissionNeedsTitoAndHub,
} from '@typeDefs/emails';
import { InviteRole } from './InvitePanel';

interface Props {
  rsvpLists: RsvpList[];
  releases: Release[];
  role: InviteRole;
}

interface SuccessUrls {
  admissionType?: HackerAdmissionType;
  titoUrl?: string;
  inviteUrl?: string;
}

export default function SingleInviteForm({ rsvpLists, releases, role }: Props) {
  const [loading, setLoading] = useState(false);
  const [successUrls, setSuccessUrls] = useState<SuccessUrls | null>(null);
  const [error, setError] = useState('');
  const [selectedListSlug, setSelectedListSlug] = useState(
    rsvpLists[0]?.slug ?? ''
  );
  const [selectedReleases, setSelectedReleases] = useState<string[]>([]);
  const [admissionType, setAdmissionType] =
    useState<HackerAdmissionType>('accept');

  const hasTito = role !== 'judge';
  const hackerNeedsLinks =
    role === 'hacker' && admissionNeedsTitoAndHub(admissionType);

  const toggleRelease = (id: string) =>
    setSelectedReleases((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (role === 'hacker' && hackerNeedsLinks && !selectedListSlug) {
      setError('Please select an RSVP list.');
      return;
    }
    if (
      role === 'hacker' &&
      hackerNeedsLinks &&
      selectedReleases.length === 0
    ) {
      setError('Please select at least one release.');
      return;
    }
    if (hasTito && role !== 'hacker' && !selectedListSlug) {
      setError('Please select an RSVP list.');
      return;
    }
    if (hasTito && role !== 'hacker' && selectedReleases.length === 0) {
      setError('Please select at least one release.');
      return;
    }

    setLoading(true);
    setSuccessUrls(null);
    setError('');

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;

    let result: {
      ok: boolean;
      admissionType?: HackerAdmissionType;
      titoUrl?: string;
      inviteUrl?: string;
      error: string | null;
    };

    if (role === 'judge') {
      result = await sendSingleJudgeHubInvite({ firstName, lastName, email });
    } else if (role === 'hacker') {
      result = await sendSingleHackerInvite({
        firstName,
        lastName,
        email,
        admissionType,
        rsvpListSlug: selectedListSlug,
        releaseIds: selectedReleases.join(','),
      });
    } else {
      const mentorResult = await sendSingleMentorOrVolunteerInvite({
        firstName,
        lastName,
        email,
        rsvpListSlug: selectedListSlug,
        releaseIds: selectedReleases.join(','),
        role,
      });
      result = { ...mentorResult, inviteUrl: undefined };
    }

    setLoading(false);

    if (result.ok) {
      setSuccessUrls({
        admissionType: result.admissionType,
        titoUrl: result.titoUrl,
        inviteUrl: result.inviteUrl,
      });
      (e.target as HTMLFormElement).reset();
      setSelectedReleases([]);
    } else {
      setError(result.error ?? 'An unexpected error occurred.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
      {/* Admission type selector — hackers only */}
      {role === 'hacker' && (
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Admission Decision
          </label>
          <div className="flex gap-2 flex-wrap">
            {HACKER_ADMISSION_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setAdmissionType(type)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                  admissionType === type
                    ? 'bg-[#005271] text-white border-[#005271]'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {HACKER_ADMISSION_LABELS[type]}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            {hackerNeedsLinks
              ? 'Sends a Tito e-ticket + Hub registration invite.'
              : 'Sends an email only — no Tito or Hub invite.'}
          </p>
        </div>
      )}

      {/* Name + Email */}
      <div className="flex gap-4">
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-sm font-medium text-gray-700">
            First Name
          </label>
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

      {/* Tito config — shown for non-judges; for hackers only when type needs it */}
      {hasTito && (role !== 'hacker' || hackerNeedsLinks) && (
        <>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              RSVP List
            </label>
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
                {selectedReleases.length === releases.length
                  ? 'Deselect all'
                  : 'Select all'}
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
                  <span className="text-gray-800 font-medium">
                    {release.title}
                  </span>
                  <span className="text-gray-400 text-xs ml-auto">
                    {release.id}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-[#005271] text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-[#003d54] disabled:opacity-50 disabled:cursor-not-allowed transition-colors self-start"
      >
        {loading ? 'Sending…' : 'Send Email'}
      </button>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </p>
      )}
      {successUrls && (
        <div className="bg-green-50 border border-green-200 rounded-md px-3 py-2 flex flex-col gap-2">
          <p className="text-sm font-medium text-green-700">
            Email sent
            {successUrls.admissionType
              ? ` (${HACKER_ADMISSION_LABELS[successUrls.admissionType]})`
              : ''}
            !
          </p>
          {successUrls.titoUrl && (
            <div>
              <p className="text-xs font-medium text-green-600">Tito ticket:</p>
              <p className="text-xs text-green-600 break-all">
                {successUrls.titoUrl}
              </p>
            </div>
          )}
          {successUrls.inviteUrl && (
            <div>
              <p className="text-xs font-medium text-green-600">Hub invite:</p>
              <p className="text-xs text-green-600 break-all">
                {successUrls.inviteUrl}
              </p>
            </div>
          )}
        </div>
      )}
    </form>
  );
}
