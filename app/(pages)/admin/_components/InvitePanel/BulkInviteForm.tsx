'use client';

import { ChangeEvent, useState } from 'react';
import { parse } from 'csv-parse/sync';
import sendBulkMentorOrVolunteerInvites from '@actions/emails/sendBulkMentorOrVolunteerInvites';
import sendBulkHackerInvites from '@actions/emails/sendBulkHackerInvites';
import sendBulkJudgeHubInvites from '@actions/emails/sendBulkJudgeHubInvites';
import {
  InviteData,
  HackerAdmissionType,
  HACKER_ADMISSION_TYPES,
  HACKER_ADMISSION_LABELS,
  admissionNeedsTitoAndHub,
} from '@typeDefs/emails';
import { Release, RsvpList } from '@typeDefs/tito';
import {
  buildFailureDownloadFilename,
  generateInviteFailuresCSV,
  InviteDataWithType,
} from '../../_utils/generateInviteFailuresCSV';
import {
  generateInviteResultsCSV,
  InviteResultRow,
} from '../../_utils/generateInviteResultsCSV';
import { InviteRole } from './InvitePanel';

interface DisplayResult {
  email: string;
  success: boolean;
  error?: string;
  admissionType?: HackerAdmissionType;
  titoUrl?: string;
  inviteUrl?: string;
}

interface DisplayBulkResponse {
  ok: boolean;
  results: DisplayResult[];
  successCount: number;
  failureCount: number;
  error: string | null;
}

// Extended preview row for hackers (includes admissionType)
interface HackerPreviewRow extends InviteData {
  admissionType: HackerAdmissionType;
}

const VALID_ADMISSION_TYPES = new Set<string>(HACKER_ADMISSION_TYPES);

function normalizeAdmissionType(raw: string): HackerAdmissionType | null {
  const normalized = raw.trim().toLowerCase().replace(/[- ]/g, '_');
  return VALID_ADMISSION_TYPES.has(normalized)
    ? (normalized as HackerAdmissionType)
    : null;
}

/**
 * Browser-safe CSV preview parser for non-hacker roles (3 columns).
 */
function previewCSV(
  text: string
): { ok: true; rows: InviteData[] } | { ok: false; error: string } {
  if (!text.trim()) return { ok: false, error: 'CSV is empty.' };

  let parsedRows: string[][];
  try {
    parsedRows = parse(text, {
      trim: true,
      skip_empty_lines: true,
    }) as string[][];
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error && error.message
          ? `Could not parse CSV: ${error.message}`
          : 'Could not parse CSV.',
    };
  }

  if (parsedRows.length === 0) return { ok: false, error: 'CSV is empty.' };

  const firstCells = parsedRows[0].map((cell) => cell.toLowerCase());
  const hasHeader =
    firstCells.some((cell) => cell.includes('first')) ||
    firstCells.some((cell) => cell.includes('email'));
  const dataRows = hasHeader ? parsedRows.slice(1) : parsedRows;
  if (dataRows.length === 0) return { ok: false, error: 'No data rows found.' };

  const previewRows: InviteData[] = [];
  for (let i = 0; i < dataRows.length; i++) {
    const cols = dataRows[i];
    if (cols.length < 3) {
      return {
        ok: false,
        error: `Row ${hasHeader ? i + 2 : i + 1}: expected 3 columns, got ${
          cols.length
        }.`,
      };
    }
    previewRows.push({ firstName: cols[0], lastName: cols[1], email: cols[2] });
  }
  return { ok: true, rows: previewRows };
}

/**
 * Browser-safe CSV preview parser for hackers (4 columns: First Name, Last Name, Email, Type).
 */
function previewHackerCSV(
  text: string
): { ok: true; rows: HackerPreviewRow[] } | { ok: false; error: string } {
  if (!text.trim()) return { ok: false, error: 'CSV is empty.' };

  let parsedRows: string[][];
  try {
    parsedRows = parse(text, {
      trim: true,
      skip_empty_lines: true,
    }) as string[][];
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error && error.message
          ? `Could not parse CSV: ${error.message}`
          : 'Could not parse CSV.',
    };
  }

  if (parsedRows.length === 0) return { ok: false, error: 'CSV is empty.' };

  const firstCells = parsedRows[0].map((cell) => cell.toLowerCase());
  const hasHeader =
    firstCells.some((cell) => cell.includes('first')) ||
    firstCells.some((cell) => cell.includes('email'));
  const dataRows = hasHeader ? parsedRows.slice(1) : parsedRows;
  if (dataRows.length === 0) return { ok: false, error: 'No data rows found.' };

  const previewRows: HackerPreviewRow[] = [];
  for (let i = 0; i < dataRows.length; i++) {
    const cols = dataRows[i];
    const rowNum = hasHeader ? i + 2 : i + 1;
    if (cols.length < 4) {
      return {
        ok: false,
        error: `Row ${rowNum}: expected 4 columns (First Name, Last Name, Email, Type), got ${cols.length}.`,
      };
    }
    const admissionType = normalizeAdmissionType(cols[3] ?? '');
    if (!admissionType) {
      return {
        ok: false,
        error: `Row ${rowNum}: "${
          cols[3]
        }" is not a valid type. Must be one of: ${HACKER_ADMISSION_TYPES.join(
          ', '
        )}.`,
      };
    }
    previewRows.push({
      firstName: cols[0],
      lastName: cols[1],
      email: cols[2],
      admissionType,
    });
  }
  return { ok: true, rows: previewRows };
}

type Status = 'idle' | 'previewing' | 'sending' | 'done';

interface Props {
  rsvpLists: RsvpList[];
  releases: Release[];
  role: InviteRole;
}

export default function BulkInviteForm({ rsvpLists, releases, role }: Props) {
  const [status, setStatus] = useState<Status>('idle');
  const [csvText, setCsvText] = useState('');
  const [fileName, setFileName] = useState('');
  const [preview, setPreview] = useState<InviteData[]>([]);
  const [hackerPreview, setHackerPreview] = useState<HackerPreviewRow[]>([]);
  const [parseError, setParseError] = useState('');
  const [result, setResult] = useState<DisplayBulkResponse | null>(null);
  const [selectedListSlug, setSelectedListSlug] = useState(
    rsvpLists[0]?.slug ?? ''
  );
  const [selectedReleases, setSelectedReleases] = useState<string[]>([]);
  const [configError, setConfigError] = useState('');

  const hasTito = role !== 'judge';

  // For hackers: Tito is only required when any row needs links
  const hackerRowsNeedTito =
    role === 'hacker' &&
    hackerPreview.some((r) => admissionNeedsTitoAndHub(r.admissionType));

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
      setFileName(file.name);
      setCsvText(text);

      if (role === 'hacker') {
        const parsed = previewHackerCSV(text);
        if (parsed.ok) {
          setHackerPreview(parsed.rows);
          setPreview(parsed.rows); // keep for result export
          setParseError('');
          setStatus('previewing');
        } else {
          setParseError(parsed.error);
          setHackerPreview([]);
          setPreview([]);
          setStatus('idle');
        }
      } else {
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
      }
    };
    reader.readAsText(file);
  };

  const handleSend = async () => {
    if (hackerRowsNeedTito && !selectedListSlug) {
      setConfigError(
        'Please select an RSVP list (required for Accept / Waitlist Accept rows).'
      );
      return;
    }
    if (hackerRowsNeedTito && selectedReleases.length === 0) {
      setConfigError(
        'Please select at least one release (required for Accept / Waitlist Accept rows).'
      );
      return;
    }
    if (hasTito && role !== 'hacker' && !selectedListSlug) {
      setConfigError('Please select an RSVP list.');
      return;
    }
    if (hasTito && role !== 'hacker' && selectedReleases.length === 0) {
      setConfigError('Please select at least one release.');
      return;
    }

    setConfigError('');
    setStatus('sending');
    setResult(null);

    let response: DisplayBulkResponse;

    if (role === 'judge') {
      const r = await sendBulkJudgeHubInvites(csvText);
      response = {
        ...r,
        results: r.results.map((res) => ({
          email: res.email,
          success: res.success,
          error: res.error,
          inviteUrl: res.inviteUrl,
        })),
      };
    } else if (role === 'hacker') {
      const r = await sendBulkHackerInvites(
        csvText,
        selectedListSlug,
        selectedReleases.join(',')
      );
      response = {
        ...r,
        results: r.results.map((res) => ({
          email: res.email,
          success: res.success,
          error: res.error,
          admissionType: res.admissionType,
          titoUrl: res.titoUrl,
          inviteUrl: res.inviteUrl,
        })),
      };
    } else {
      const r = await sendBulkMentorOrVolunteerInvites(
        csvText,
        selectedListSlug,
        selectedReleases.join(','),
        role
      );
      response = {
        ...r,
        results: r.results.map((res) => ({
          email: res.email,
          success: res.success,
          error: res.error,
          titoUrl: res.titoUrl,
        })),
      };
    }

    setResult(response);
    setStatus('done');
  };

  const handleDownloadCSV = () => {
    if (!result) return;
    const resultMap = new Map(
      result.results.map((r) => [r.email.toLowerCase(), r])
    );
    const includeHub = role === 'hacker' || role === 'judge';
    const rows: InviteResultRow[] = preview.map((person) => {
      const res = resultMap.get(person.email.toLowerCase());
      return {
        firstName: person.firstName,
        lastName: person.lastName,
        email: person.email,
        admissionType: (person as HackerPreviewRow).admissionType,
        titoUrl: res?.titoUrl,
        hubUrl: res?.inviteUrl,
        success: res?.success ?? false,
        error: res?.error,
      };
    });
    const csv = generateInviteResultsCSV(rows, includeHub);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${role}-invites-${
      new Date().toISOString().split('T')[0]
    }.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadFailuresCSV = () => {
    if (!result || result.failureCount === 0) return;
    const csv = generateInviteFailuresCSV(preview as InviteDataWithType[], result.results);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = buildFailureDownloadFilename(
      fileName || `${role}-invites.csv`
    );
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setStatus('idle');
    setCsvText('');
    setFileName('');
    setPreview([]);
    setHackerPreview([]);
    setParseError('');
    setResult(null);
    setConfigError('');
    setSelectedReleases([]);
  };

  const previewCount =
    role === 'hacker' ? hackerPreview.length : preview.length;

  return (
    <div className="flex flex-col gap-4 max-w-2xl">
      {/* File input */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">
          Upload CSV{' '}
          <span className="text-gray-400 font-normal">
            {role === 'hacker'
              ? '(columns: First Name, Last Name, Email, Type)'
              : '(columns: First Name, Last Name, Email)'}
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
      {status === 'previewing' && previewCount > 0 && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">{previewCount}</span> {role}
            {previewCount !== 1 ? 's' : ''} found.{' '}
            {hasTito && (role !== 'hacker' || hackerRowsNeedTito)
              ? 'Configure Tito settings and review before sending:'
              : 'Review before sending:'}
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
                    {role === 'hacker' && (
                      <th className="text-left px-4 py-2 font-medium text-gray-600 border-b border-gray-200">
                        Type
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {(role === 'hacker' ? hackerPreview : preview).map(
                    (person, i) => (
                      <tr
                        key={i}
                        className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                      >
                        <td className="px-4 py-2 text-gray-800">
                          {person.firstName}
                        </td>
                        <td className="px-4 py-2 text-gray-800">
                          {person.lastName}
                        </td>
                        <td className="px-4 py-2 text-gray-600">
                          {person.email}
                        </td>
                        {role === 'hacker' && (
                          <td className="px-4 py-2">
                            <AdmissionTypeBadge
                              type={(person as HackerPreviewRow).admissionType}
                            />
                          </td>
                        )}
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tito config — shown for non-judges; for hackers only when needed */}
          {hasTito && (role !== 'hacker' || hackerRowsNeedTito) && (
            <>
              {role === 'hacker' && (
                <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
                  Required for Accept and Waitlist Accept rows. Waitlist and
                  Reject rows send email only.
                </p>
              )}

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

          {configError && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {configError}
            </p>
          )}

          <button
            onClick={handleSend}
            className="bg-[#005271] text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-[#003d54] transition-colors self-start"
          >
            Send {previewCount} Email{previewCount !== 1 ? 's' : ''}
          </button>
        </div>
      )}

      {/* Sending spinner */}
      {status === 'sending' && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-4 h-4 border-2 border-[#005271] border-t-transparent rounded-full animate-spin" />
          Sending emails…
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

          {result.error && (
            <div className="border border-red-200 rounded-lg bg-red-50 px-4 py-3">
              <p className="text-sm font-semibold text-red-700">Batch error</p>
              <p className="text-sm text-red-700 mt-1">{result.error}</p>
            </div>
          )}

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
                        {r.admissionType && (
                          <span className="ml-2">
                            <AdmissionTypeBadge type={r.admissionType} />
                          </span>
                        )}
                      </span>
                      <span className="text-xs text-red-600">{r.error}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4">
            {result.failureCount > 0 && (
              <button
                onClick={handleDownloadFailuresCSV}
                className="bg-[#005271] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#003d54] transition-colors"
              >
                Download Failures CSV
              </button>
            )}
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

const BADGE_STYLES: Record<HackerAdmissionType, string> = {
  accept: 'bg-green-100 text-green-700',
  waitlist_accept: 'bg-teal-100 text-teal-700',
  waitlist: 'bg-amber-100 text-amber-700',
  reject: 'bg-red-100 text-red-700',
};

function AdmissionTypeBadge({ type }: { type: HackerAdmissionType }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${BADGE_STYLES[type]}`}
    >
      {HACKER_ADMISSION_LABELS[type]}
    </span>
  );
}
