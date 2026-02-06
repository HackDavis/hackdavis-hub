'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { RsvpList, Release } from '@typeDefs/tito';
import getRsvpLists from '@actions/tito/getRsvpLists';
import createRsvpList from '@actions/tito/createRsvpList';
import createRsvpInvitation from '@actions/tito/createRsvpInvitation';
import getReleases from '@actions/tito/getReleases';

export default function TitoRsvpManager() {
  const [rsvpLists, setRsvpLists] = useState<RsvpList[]>([]);
  const [selectedListId, setSelectedListId] = useState<string>('');
  const [selectedListSlug, setSelectedListSlug] = useState<string>('');
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [invitationUrl, setInvitationUrl] = useState('');
  const [showCreateList, setShowCreateList] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [selectedReleases, setSelectedReleases] = useState<string[]>([]);

  const loadReleases = useCallback(async () => {
    try {
      const response = await getReleases();
      if (response.ok && response.body) {
        setReleases(response.body);
        console.log('Loaded releases:', response.body);
      } else {
        console.error('Failed to load releases:', response.error);
        setError(
          `Could not load releases: ${response.error}. Check server logs for details.`
        );
      }
    } catch (e) {
      console.error('Failed to load releases:', e);
    }
  }, []);

  const loadRsvpLists = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getRsvpLists();
      if (response.ok && response.body) {
        setRsvpLists(response.body);
        if (response.body.length > 0 && !selectedListId) {
          setSelectedListId(response.body[0].id);
          setSelectedListSlug(response.body[0].slug);
        }
      } else {
        setError(response.error || 'Failed to load RSVP lists');
      }
    } catch (e) {
      setError('An unexpected error occurred while loading RSVP lists');
    } finally {
      setLoading(false);
    }
  }, [selectedListId]);

  useEffect(() => {
    loadRsvpLists();
    loadReleases();
  }, [loadRsvpLists, loadReleases]);

  const handleCreateList = async (e: FormEvent) => {
    e.preventDefault();
    if (!newListTitle.trim()) {
      setError('Please enter a list title');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setInvitationUrl('');

    try {
      const response = await createRsvpList(newListTitle);
      if (response.ok && response.body) {
        setSuccess(`RSVP list "${response.body.title}" created successfully!`);
        setNewListTitle('');
        setShowCreateList(false);
        await loadRsvpLists();
        setSelectedListId(response.body.id);
        setSelectedListSlug(response.body.slug);
      } else {
        setError(response.error || 'Failed to create RSVP list');
      }
    } catch (e) {
      setError('An unexpected error occurred while creating the RSVP list');
    } finally {
      setLoading(false);
    }
  };

  const handleSendInvitation = async (e: FormEvent<HTMLFormElement>) => {
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

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const discountCode = formData.get('discountCode') as string;
    const releaseIds = selectedReleases.join(',');

    try {
      const response = await createRsvpInvitation({
        firstName,
        lastName,
        email,
        rsvpListSlug: selectedListSlug,
        releaseIds,
        discountCode: discountCode || undefined,
      });

      if (response.ok && response.body) {
        const fullName = [response.body.first_name, response.body.last_name]
          .filter(Boolean)
          .join(' ');
        setSuccess(
          `Invitation sent successfully to ${response.body.email}${
            fullName ? ` (${fullName})` : ''
          }`
        );
        const inviteUrl = response.body.unique_url || response.body.url;
        if (inviteUrl) {
          setInvitationUrl(inviteUrl);
        }
        (e.target as HTMLFormElement).reset();
      } else {
        setError(response.error || 'Failed to send invitation');
      }
    } catch (e) {
      setError('An unexpected error occurred while sending the invitation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">
        Tito RSVP Management
      </h2>

      <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-700">RSVP Lists</h3>
          <button
            type="button"
            onClick={() => setShowCreateList(!showCreateList)}
            className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {showCreateList ? 'Cancel' : 'Create New List'}
          </button>
        </div>

        {showCreateList && (
          <form
            onSubmit={handleCreateList}
            className="bg-white p-6 rounded-lg mb-4 border border-gray-200"
          >
            <div className="mb-4">
              <label
                htmlFor="listTitle"
                className="block mb-2 font-medium text-gray-700"
              >
                New List Title
              </label>
              <input
                id="listTitle"
                type="text"
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                placeholder="e.g., VIP Attendees"
                required
                disabled={loading}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create List'}
            </button>
          </form>
        )}

        <div className="mb-4">
          <label
            htmlFor="rsvpList"
            className="block mb-2 font-medium text-gray-700"
          >
            Select RSVP List
          </label>
          <select
            id="rsvpList"
            value={selectedListId}
            onChange={(e) => {
              setSelectedListId(e.target.value);
              const selectedList = rsvpLists.find(
                (list) => list.id === e.target.value
              );
              setSelectedListSlug(selectedList?.slug || '');
            }}
            disabled={loading || rsvpLists.length === 0}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
          >
            {rsvpLists.length === 0 && (
              <option value="">No RSVP lists available</option>
            )}
            {rsvpLists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.title} ({list.slug})
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={loadRsvpLists}
            className="mt-2 bg-green-600 text-white py-2 px-4 rounded text-sm hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={loading}
          >
            Refresh Lists
          </button>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">
          Send Release Invitation
        </h3>

        <form
          onSubmit={handleSendInvitation}
          className="bg-white p-6 rounded-lg border border-gray-200"
        >
          <div className="mb-4">
            <label
              htmlFor="firstName"
              className="block mb-2 font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="John"
              disabled={loading}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="lastName"
              className="block mb-2 font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Doe"
              disabled={loading}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
            />
          </div>

          <div className="mb-4">
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
                      <strong>{release.title}</strong> ({release.slug})
                      {release.quantity && ` - Qty: ${release.quantity}`}
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

          <div className="mb-4">
            <label
              htmlFor="discountCode"
              className="block mb-2 font-medium text-gray-700"
            >
              Discount Code (Optional)
            </label>
            <input
              id="discountCode"
              name="discountCode"
              type="text"
              placeholder="DISCOUNT2026"
              disabled={loading}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !selectedListSlug}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Send Invitation'}
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded-lg border border-red-300">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 text-green-800 p-4 rounded-lg border border-green-300">
          <p className="mb-0">{success}</p>
          {invitationUrl && (
            <div className="mt-4 pt-4 border-t border-green-300">
              <p className="mb-2">
                <strong>Invitation URL:</strong>
              </p>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={invitationUrl}
                  readOnly
                  className="flex-1 p-2 border border-green-300 rounded bg-white font-mono text-sm"
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(invitationUrl);
                    alert('Invitation URL copied to clipboard!');
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Copy
                </button>
              </div>
              <a
                href={invitationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-900 underline text-sm"
              >
                Open invitation link
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
