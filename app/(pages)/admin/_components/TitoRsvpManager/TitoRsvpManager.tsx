'use client';

import { FormEvent, useEffect, useState } from 'react';
import getRsvpLists from '@actions/tito/getRsvpLists';
import createRsvpList from '@actions/tito/createRsvpList';
import createRsvpInvitation from '@actions/tito/createRsvpInvitation';
import getReleases from '@actions/tito/getReleases';
import styles from './TitoRsvpManager.module.scss';

interface RsvpList {
  id: string;
  slug: string;
  title: string;
}

interface Release {
  id: string;
  slug: string;
  title: string;
  quantity?: number;
}

export default function TitoRsvpManager() {
  const [rsvpLists, setRsvpLists] = useState<RsvpList[]>([]);
  const [selectedListId, setSelectedListId] = useState<string>('');
  const [selectedListSlug, setSelectedListSlug] = useState<string>('');
  const [releases, setReleases] = useState<Release[]>([]);
  const [showReleases, setShowReleases] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCreateList, setShowCreateList] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');

  useEffect(() => {
    loadRsvpLists();
    loadReleases();
  }, []);

  const loadReleases = async () => {
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
  };

  const loadRsvpLists = async () => {
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
  };

  const handleCreateList = async (e: FormEvent) => {
    e.preventDefault();
    if (!newListTitle.trim()) {
      setError('Please enter a list title');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

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

    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const releaseIds = formData.get('releaseIds') as string;
    const discountCode = formData.get('discountCode') as string;

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
        setSuccess(
          `Invitation sent successfully to ${response.body.email} (${response.body.first_name} ${response.body.last_name})`
        );
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
    <div className={styles.container}>
      <h2>Tito RSVP Management</h2>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>RSVP Lists</h3>
          <button
            type="button"
            onClick={() => setShowCreateList(!showCreateList)}
            className={styles.secondaryButton}
            disabled={loading}
          >
            {showCreateList ? 'Cancel' : 'Create New List'}
          </button>
        </div>

        {showCreateList && (
          <form onSubmit={handleCreateList} className={styles.createListForm}>
            <div className={styles.formGroup}>
              <label htmlFor="listTitle">New List Title</label>
              <input
                id="listTitle"
                type="text"
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                placeholder="e.g., VIP Attendees"
                required
                disabled={loading}
              />
            </div>
            <button type="submit" disabled={loading} className={styles.button}>
              {loading ? 'Creating...' : 'Create List'}
            </button>
          </form>
        )}

        <div className={styles.formGroup}>
          <label htmlFor="rsvpList">Select RSVP List</label>
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
            className={styles.refreshButton}
            disabled={loading}
          >
            Refresh Lists
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Send Release Invitation</h3>

        <div className={styles.releasesInfo}>
          <button
            type="button"
            onClick={() => setShowReleases(!showReleases)}
            className={styles.secondaryButton}
          >
            {showReleases ? 'Hide' : 'Show'} Available Releases
          </button>

          {showReleases && (
            <div className={styles.releasesList}>
              <h4>Available Releases (Ticket Types)</h4>
              {releases.length === 0 ? (
                <div>
                  <p>
                    No releases found via API. Your &quot;test ticket&quot; should appear
                    here.
                  </p>
                  <p className={styles.helpText}>
                    Check the server console logs for API errors. Make sure your
                    TITO_EVENT_SLUG matches your event (currently using
                    &quot;hackdavis-2026-test&quot;).
                  </p>
                  <p className={styles.helpText}>
                    <strong>Workaround:</strong> Click on your &quot;test ticket&quot; in
                    Tito, check the URL for its ID, and manually enter it below.
                  </p>
                </div>
              ) : (
                <ul>
                  {releases.map((release) => (
                    <li key={release.id}>
                      <strong>ID: {release.id}</strong> - {release.title} (
                      {release.slug})
                      {release.quantity && ` - Qty: ${release.quantity}`}
                    </li>
                  ))}
                </ul>
              )}
              {releases.length > 0 && (
                <p className={styles.helpText}>
                  Copy the ID numbers above and paste them below (comma-separated
                  if multiple)
                </p>
              )}
            </div>
          )}
        </div>

        <form onSubmit={handleSendInvitation} className={styles.invitationForm}>
          <div className={styles.formGroup}>
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="John"
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Doe"
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              required
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="releaseIds">
              Release IDs * (comma-separated, e.g., 1,2,3)
            </label>
            <input
              id="releaseIds"
              name="releaseIds"
              type="text"
              placeholder="1,2,3"
              required
              disabled={loading}
            />
            {releases.length > 0 && (
              <button
                type="button"
                className={styles.autoFillButton}
                onClick={() => {
                  const input = document.getElementById(
                    'releaseIds'
                  ) as HTMLInputElement;
                  if (input) {
                    input.value = releases.map((r) => r.id).join(',');
                  }
                }}
              >
                Auto-fill all release IDs
              </button>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="discountCode">Discount Code (Optional)</label>
            <input
              id="discountCode"
              name="discountCode"
              type="text"
              placeholder="DISCOUNT2026"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !selectedListSlug}
            className={styles.button}
          >
            {loading ? 'Sending...' : 'Send Invitation'}
          </button>
        </form>
      </div>

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}
    </div>
  );
}
