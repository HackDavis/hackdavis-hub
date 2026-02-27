'use client';

import { ChangeEvent, useState } from 'react';
import sendBulkMentorInvites from '@actions/emails/sendBulkMentorInvites';
import { BulkMentorInviteResponse, MentorInviteData } from '@typeDefs/emails';
import { Release, RsvpList } from '@typeDefs/tito';
import { generateInviteResultsCSV } from '../../_utils/generateInviteResultsCSV';

/**
 * Browser-safe CSV preview parser (no Node.js deps). Full validation runs server-side.
 * Note: uses simple comma-split — quoted fields containing commas are not supported.
 */
function previewCSV(
  text: string
): { ok: true; rows: MentorInviteData[] } | { ok: false; error: string } {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return { ok: false, error: 'CSV is empty.' };

  const firstCells = lines[0].toLowerCase();
  const hasHeader =
    firstCells.includes('first') || firstCells.includes('email');
  const dataLines = hasHeader ? lines.slice(1) : lines;
  if (dataLines.length === 0)
    return { ok: false, error: 'No data rows found.' };

  const rows: MentorInviteData[] = [];
  for (let i = 0; i < dataLines.length; i++) {
    const cols = dataLines[i].split(',').map((c) => c.trim());
    if (cols.length < 3) {
      return {
        ok: false,
        error: `Row ${hasHeader ? i + 2 : i + 1}: expected 3 columns, got ${
          cols.length
        }.`,
      };
    }
    rows.push({ firstName: cols[0], lastName: cols[1], email: cols[2] });
  }
  return { ok: true, rows };
}

type Status = 'idle' | 'previewing' | 'sending' | 'done';

interface Props {
  rsvpLists: RsvpList[];
  releases: Release[];
}

export default function MentorBulkInviteForm({ rsvpLists, releases }: Props) {
  const [status, setStatus] = useState<Status>('idle');
  const [csvText, setCsvText] = useState('');
  const [preview, setPreview] = useState<MentorInviteData[]>([]);
  const [parseError, setParseError] = useState('');
  const [result, setResult] = useState<BulkMentorInviteResponse | null>(null);
  const [selectedListSlug, setSelectedListSlug] = useState(
    rsvpLists[0]?.slug ?? ''
  );
  const [selectedReleases, setSelectedReleases] = useState<string[]>([]);
  const [configError, setConfigError] = useState('');

  const toggleRelease = (id: string) =>
    setSelectedReleases((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setCsvText(text);
      const parsed = previewCSV(text);
      if (parsed.ok) {
        setPreview(parsed.rows);
        setParseError('');
        setStatus('previewing');
      } else {
        setParseError(parsed.error);
        setPreview([]);
        setStatus('idle');
      }
    };
    reader.readAsText(file);
  };

  const handleSend = async () => {
    if (!selectedListSlug) {
      setConfigError('Please select an RSVP list.');
      return;
    }
    if (selectedReleases.length === 0) {
      setConfigError('Please select at least one release.');
      return;
    }
    setConfigError('');
    setStatus('sending');
    setResult(null);

    const response = await sendBulkMentorInvites(
      csvText,
      selectedListSlug,
      selectedReleases.join(',')
    );
    setResult(response);
    setStatus('done');
  };

  const handleDownloadCSV = () => {
    if (!result) return;
    const resultMap = new Map(
      result.results.map((r) => [r.email.toLowerCase(), r])
    );
    const rows = preview.map((mentor) => {
      const res = resultMap.get(mentor.email.toLowerCase());
      return {
        firstName: mentor.firstName,
        lastName: mentor.lastName,
        email: mentor.email,
        titoUrl: res?.titoUrl,
        success: res?.success ?? false,
        error: res?.error,
      };
    });
    const csv = generateInviteResultsCSV(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mentor-invites-${
      new Date().toISOString().split('T')[0]
    }.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setStatus('idle');
    setCsvText('');
    setPreview([]);
    setParseError('');
    setResult(null);
    setConfigError('');
    setSelectedReleases([]);
  };

  return (
    <div className="flex flex-col gap-4 max-w-2xl">
      {/* File input */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">
          Upload CSV{' '}
          <span className="text-gray-400 font-normal">
            (columns: First Name, Last Name, Email)
          </span>
        </label>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          disabled={status === 'sending'}
          className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#005271] file:text-white hover:file:bg-[#003d54] file:cursor-pointer disabled:opacity-50"
        />
      </div>

      {/* Parse error */}
      {parseError && (
        <div className="bg-red-50 border border-red-200 rounded-md px-3 py-2">
          <p className="text-sm font-semibold text-red-700 mb-1">CSV errors:</p>
          <pre className="text-xs text-red-600 whitespace-pre-wrap">
            {parseError}
          </pre>
        </div>
      )}

      {/* Preview table */}
      {status === 'previewing' && preview.length > 0 && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">{preview.length}</span> mentor
            {preview.length !== 1 ? 's' : ''} found. Configure Tito settings and
            review before sending:
          </p>

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="max-h-52 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="text-left px-4 py-2 font-medium text-gray-600 border-b border-gray-200">
                      First Name
                    </th>
                    <th className="text-left px-4 py-2 font-medium text-gray-600 border-b border-gray-200">
                      Last Name
                    </th>
                    <th className="text-left px-4 py-2 font-medium text-gray-600 border-b border-gray-200">
                      Email
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {preview.map((mentor, i) => (
                    <tr
                      key={i}
                      className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    >
                      <td className="px-4 py-2 text-gray-800">
                        {mentor.firstName}
                      </td>
                      <td className="px-4 py-2 text-gray-800">
                        {mentor.lastName}
                      </td>
                      <td className="px-4 py-2 text-gray-600">
                        {mentor.email}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* RSVP List */}
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

          {configError && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {configError}
            </p>
          )}

          <button
            onClick={handleSend}
            className="bg-[#005271] text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-[#003d54] transition-colors self-start"
          >
            Send {preview.length} Invite{preview.length !== 1 ? 's' : ''}
          </button>
        </div>
      )}

      {/* Sending spinner */}
      {status === 'sending' && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-4 h-4 border-2 border-[#005271] border-t-transparent rounded-full animate-spin" />
          Sending invites…
        </div>
      )}

      {/* Results */}
      {status === 'done' && result && (
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 flex-1 text-center">
              <p className="text-2xl font-bold text-green-700">
                {result.successCount}
              </p>
              <p className="text-sm text-green-600">Sent</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex-1 text-center">
              <p className="text-2xl font-bold text-red-700">
                {result.failureCount}
              </p>
              <p className="text-sm text-red-600">Failed</p>
            </div>
          </div>

          {result.failureCount > 0 && (
            <div className="border border-red-200 rounded-lg overflow-hidden">
              <p className="text-sm font-semibold text-red-700 bg-red-50 px-4 py-2 border-b border-red-200">
                Failed invites
              </p>
              <div className="max-h-48 overflow-y-auto">
                {result.results
                  .filter((r) => !r.success)
                  .map((r, i) => (
                    <div
                      key={i}
                      className="flex flex-col gap-0.5 px-4 py-2 border-b border-gray-100 last:border-0"
                    >
                      <span className="text-sm font-medium text-gray-800">
                        {r.email}
                      </span>
                      <span className="text-xs text-red-600">{r.error}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4">
            <button
              onClick={handleDownloadCSV}
              className="bg-[#005271] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#003d54] transition-colors"
            >
              Download Results CSV
            </button>
            <button
              onClick={handleReset}
              className="text-sm text-[#005271] underline"
            >
              Send another batch
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
