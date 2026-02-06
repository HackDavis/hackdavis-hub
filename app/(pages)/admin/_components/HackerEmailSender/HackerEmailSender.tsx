'use client';

import { FormEvent, useState, useEffect } from 'react';
import getRsvpLists from '@actions/tito/getRsvpLists';
import getReleases from '@actions/tito/getReleases';
import sendHackerEmail from '@actions/emails/sendHackerEmail';
import { RsvpList, Release } from '@typeDefs/tito';

const EMAIL_TYPES = [
  {
    value: '2026AcceptedTemplate',
    label: 'Accepted (with Hub + Tito invite)',
  },
  { value: '2026WaitlistedTemplate', label: 'Waitlisted' },
  {
    value: '2026WaitlistAcceptedTemplate',
    label: 'Waitlist Accepted (with Hub + Tito invite)',
  },
  { value: '2026WaitlistRejectedTemplate', label: 'Waitlist Rejected' },
];

export default function HackerEmailSender() {
  const [rsvpLists, setRsvpLists] = useState<RsvpList[]>([]);
  const [releases, setReleases] = useState<Release[]>([]);
  const [selectedListSlug, setSelectedListSlug] = useState('');
  const [selectedEmailType, setSelectedEmailType] = useState(
    '2026AcceptedTemplate'
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [titoUrl, setTitoUrl] = useState('');
  const [hubUrl, setHubUrl] = useState('');
  const [selectedReleases, setSelectedReleases] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [rsvpRes, relRes] = await Promise.all([
      getRsvpLists(),
      getReleases(),
    ]);

    if (rsvpRes.ok && rsvpRes.body) {
      setRsvpLists(rsvpRes.body);
      if (rsvpRes.body.length > 0) {
        setSelectedListSlug(rsvpRes.body[0].slug);
      }
    }

    if (relRes.ok && relRes.body) {
      setReleases(relRes.body);
    }
  };

  const handleSendEmail = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (needsInvites && selectedReleases.length === 0) {
      setError('Please select at least one release');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setTitoUrl('');
    setHubUrl('');

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const releaseIds = selectedReleases.join(',');

    try {
      const response = await sendHackerEmail({
        firstName,
        lastName,
        email,
        emailType: selectedEmailType as any,
        rsvpListSlug:
          selectedEmailType === '2026AcceptedTemplate'
            ? selectedListSlug
            : undefined,
        releaseIds:
          selectedEmailType === '2026AcceptedTemplate' ? releaseIds : undefined,
      });

      if (response.ok) {
        setSuccess(`Email sent successfully to ${email}!`);
        if (response.titoUrl) setTitoUrl(response.titoUrl);
        if (response.hubUrl) setHubUrl(response.hubUrl);
        (e.target as HTMLFormElement).reset();
      } else {
        setError(response.error || 'Failed to send email');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const needsInvites = selectedEmailType === '2026AcceptedTemplate';

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">
        Send Hacker Email
      </h2>

      <form
        onSubmit={handleSendEmail}
        className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200"
      >
        <div className="mb-6">
          <label
            htmlFor="emailType"
            className="block mb-2 font-medium text-gray-700"
          >
            Email Type *
          </label>
          <select
            id="emailType"
            value={selectedEmailType}
            onChange={(e) => setSelectedEmailType(e.target.value)}
            disabled={loading}
            className="w-full p-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            {EMAIL_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {needsInvites && (
            <p className="text-sm text-yellow-800 bg-yellow-100 p-2 rounded mt-2">
              ⚠️ This will generate both a Tito ticket invite and a HackDavis
              Hub invite
            </p>
          )}
        </div>

        <div className="mb-6">
          <label
            htmlFor="firstName"
            className="block mb-2 font-medium text-gray-700"
          >
            First Name *
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            placeholder="John"
            required
            disabled={loading}
            className="w-full p-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="lastName"
            className="block mb-2 font-medium text-gray-700"
          >
            Last Name *
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Doe"
            required
            disabled={loading}
            className="w-full p-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="email"
            className="block mb-2 font-medium text-gray-700"
          >
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="john@example.com"
            required
            disabled={loading}
            className="w-full p-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        {needsInvites && (
          <>
            <div className="mb-6">
              <label
                htmlFor="rsvpList"
                className="block mb-2 font-medium text-gray-700"
              >
                RSVP List *
              </label>
              <select
                id="rsvpList"
                value={selectedListSlug}
                onChange={(e) => setSelectedListSlug(e.target.value)}
                disabled={loading}
                className="w-full p-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                {rsvpLists.map((list) => (
                  <option key={list.id} value={list.slug}>
                    {list.title} ({list.slug})
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-medium text-gray-700">
                Select Releases (Ticket Types) *
              </label>
              {releases.length === 0 ? (
                <div className="p-3 bg-yellow-50 border border-yellow-300 rounded-lg text-yellow-800 text-sm">
                  No releases found. Check server logs for API errors.
                </div>
              ) : (
                <div className="space-y-2">
                  {releases.map((release) => (
                    <label
                      key={release.id}
                      className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedReleases.includes(release.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedReleases([
                              ...selectedReleases,
                              release.id,
                            ]);
                          } else {
                            setSelectedReleases(
                              selectedReleases.filter((id) => id !== release.id)
                            );
                          }
                        }}
                        disabled={loading}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:cursor-not-allowed"
                      />
                      <span className="ml-3 text-gray-700">
                        <strong>{release.title}</strong> - {release.id}
                      </span>
                    </label>
                  ))}
                  <button
                    type="button"
                    className="mt-2 bg-cyan-600 text-white py-2 px-4 rounded text-sm hover:bg-cyan-700 disabled:bg-gray-400"
                    disabled={loading}
                    onClick={() => {
                      if (selectedReleases.length === releases.length) {
                        setSelectedReleases([]);
                      } else {
                        setSelectedReleases(releases.map((r) => r.id));
                      }
                    }}
                  >
                    {selectedReleases.length === releases.length
                      ? 'Deselect All'
                      : 'Select All'}
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg text-base font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Sending...' : 'Send Email'}
        </button>
      </form>

      {success && (
        <div className="bg-green-100 text-green-800 p-4 rounded-lg mt-4 border border-green-300">
          <p className="mb-0">{success}</p>
          {titoUrl && (
            <div className="mt-4 pt-4 border-t border-green-300">
              <strong className="block mb-2">Tito URL:</strong>
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={titoUrl}
                  readOnly
                  className="flex-1 p-2 border border-green-300 rounded bg-white font-mono text-sm"
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(titoUrl);
                    alert('Tito URL copied!');
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                >
                  Copy
                </button>
              </div>
            </div>
          )}
          {hubUrl && (
            <div className="mt-4 pt-4 border-t border-green-300">
              <strong className="block mb-2">Hub Invite URL:</strong>
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={hubUrl}
                  readOnly
                  className="flex-1 p-2 border border-green-300 rounded bg-white font-mono text-sm"
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(hubUrl);
                    alert('Hub URL copied!');
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded-lg mt-4 border border-red-300">
          {error}
        </div>
      )}
    </div>
  );
}
