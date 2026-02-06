'use client';

import { FormEvent, useState, useEffect, useRef } from 'react';
import { RsvpList, Release } from '@typeDefs/tito';
import getRsvpLists from '@actions/tito/getRsvpLists';
import getReleases from '@actions/tito/getReleases';
import sendBulkMentorInvites from '@actions/emails/sendBulkMentorInvites';
import sendSingleMentorInvite from '@actions/emails/sendSingleMentorInvite';

interface MentorData {
  firstName: string;
  lastName: string;
  email: string;
}

export default function MentorBulkInvite() {
  const [rsvpLists, setRsvpLists] = useState<RsvpList[]>([]);
  const [releases, setReleases] = useState<Release[]>([]);
  const [selectedListSlug, setSelectedListSlug] = useState('');
  const [mentors, setMentors] = useState<MentorData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [selectedReleases, setSelectedReleases] = useState<string[]>([]);
  const [inviteMode, setInviteMode] = useState<'single' | 'bulk'>('bulk');
  const [titoUrl, setTitoUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter((line) => line.trim());

        // Skip header row
        const dataLines = lines.slice(1);

        const parsed: MentorData[] = dataLines
          .map((line) => {
            const [firstName, lastName, email] = line
              .split(',')
              .map((s) => s.trim());
            return { firstName, lastName, email };
          })
          .filter((m) => m.email && m.firstName && m.lastName);

        setMentors(parsed);
        setError('');
        setSuccess(`Loaded ${parsed.length} mentors from CSV`);
      } catch (err) {
        setError('Failed to parse CSV file');
      }
    };
    reader.readAsText(file);
  };

  const handleClearCsv = () => {
    setMentors([]);
    setResults([]);
    setError('');
    setSuccess('');
    setTitoUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedListSlug) {
      setError('Please select an RSVP list');
      return;
    }

    if (selectedReleases.length === 0) {
      setError('Please select at least one release');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setResults([]);
    setTitoUrl('');

    const releaseIds = selectedReleases.join(',');

    try {
      if (inviteMode === 'single') {
        // Single invite mode
        const formData = new FormData(e.currentTarget);
        const firstName = formData.get('firstName') as string;
        const lastName = formData.get('lastName') as string;
        const email = formData.get('email') as string;

        const response = await sendSingleMentorInvite({
          firstName,
          lastName,
          email,
          rsvpListSlug: selectedListSlug,
          releaseIds,
        });

        if (response.ok) {
          setSuccess(`Invitation sent successfully to ${email}!`);
          if (response.titoUrl) {
            setTitoUrl(response.titoUrl);
          }
          (e.target as HTMLFormElement).reset();
        } else {
          setError(response.error || 'Failed to send invitation');
        }
      } else {
        // Bulk invite mode
        if (mentors.length === 0) {
          setError('Please upload a CSV file first');
          setLoading(false);
          return;
        }

        const response = await sendBulkMentorInvites({
          mentors,
          rsvpListSlug: selectedListSlug,
          releaseIds,
        });

        setResults(response.results);

        if (response.ok) {
          setSuccess(
            `Successfully sent ${response.successCount} mentor invitations!`
          );
        } else {
          setError(
            `Sent ${response.successCount} invitations, but ${response.failureCount} failed`
          );
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">
        Send Mentor Invitations
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200"
      >
        <div className="mb-6">
          <label
            htmlFor="inviteMode"
            className="block mb-2 font-medium text-gray-700"
          >
            Invite Mode *
          </label>
          <select
            id="inviteMode"
            value={inviteMode}
            onChange={(e) => {
              setInviteMode(e.target.value as 'single' | 'bulk');
              setError('');
              setSuccess('');
              setResults([]);
              setTitoUrl('');
            }}
            disabled={loading}
            className="w-full p-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="bulk">Bulk Invite (CSV Upload)</option>
            <option value="single">Single Invite</option>
          </select>
        </div>

        {inviteMode === 'single' ? (
          <>
            <div className="mb-4">
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

            <div className="mb-4">
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

            <div className="mb-4">
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
          </>
        ) : (
          <div className="mb-6">
            <label className="block mb-2 font-medium text-gray-700">
              Upload CSV File *
            </label>
            <p className="text-sm text-gray-600 mb-2">
              CSV format: FirstName, LastName, Email (with header row)
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={loading}
              ref={fileInputRef}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed p-2"
            />
            {mentors.length > 0 && (
              <div className="flex items-center justify-between mt-2">
                <p className="text-green-600 font-medium">
                  ✓ Loaded {mentors.length} mentors
                </p>
                <button
                  type="button"
                  onClick={handleClearCsv}
                  disabled={loading}
                  className="text-sm text-red-600 hover:text-red-700 disabled:text-gray-400"
                >
                  Clear CSV
                </button>
              </div>
            )}
          </div>
        )}

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
                        setSelectedReleases([...selectedReleases, release.id]);
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

        <button
          type="submit"
          disabled={loading || (inviteMode === 'bulk' && mentors.length === 0)}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg text-base font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading
            ? inviteMode === 'bulk'
              ? `Sending... (${results.length}/${mentors.length})`
              : 'Sending...'
            : inviteMode === 'bulk'
            ? `Send ${mentors.length} Invitations`
            : 'Send Invitation'}
        </button>
      </form>

      {success && (
        <div className="bg-green-100 text-green-800 p-4 rounded-lg border border-green-300">
          <p className="mb-0">{success}</p>
          {inviteMode === 'single' && titoUrl && (
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
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded-lg border border-red-300">
          {error}
        </div>
      )}

      {results.length > 0 && inviteMode === 'bulk' && (
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Results</h3>
          <div className="max-h-96 overflow-y-auto">
            {results.map((result, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg mb-2 ${
                  result.success
                    ? 'bg-green-100 border border-green-300 text-green-800'
                    : 'bg-red-100 border border-red-300 text-red-800'
                }`}
              >
                <strong>{result.email}</strong>:{' '}
                {result.success ? '✓ Sent' : `✗ ${result.error}`}
                {result.titoUrl && (
                  <div className="text-xs mt-1 opacity-80 break-all">
                    {result.titoUrl}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
