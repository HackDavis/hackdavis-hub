'use client';

import React, { useMemo, useState } from 'react';
import ParsedRecord from '@typeDefs/parsedRecord';
import { CsvRowIssue, CsvRowContact } from '@utils/csv-ingestion/csvAlgorithm';

type RowStatus = 'error' | 'warning' | 'valid';
type SortKey = 'status' | 'teamNumber' | 'tableNumber' | 'name';

const STATUS_ORDER: Record<RowStatus, number> = {
  error: 0,
  warning: 1,
  valid: 2,
};

const STATUS_PILL: Record<RowStatus, string> = {
  error: 'bg-red-100 text-red-800 border-red-200',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  valid: 'bg-green-100 text-green-800 border-green-200',
};

const STATUS_ROW_BG: Record<RowStatus, string> = {
  error: 'bg-red-50',
  warning: 'bg-yellow-50',
  valid: '',
};

function buildMemberLines(contact: CsvRowContact): string[] {
  const cols = contact.memberColumnsFromTeamMember1 ?? [];
  const canon = (s: string) =>
    s
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');

  const findByPrefix = (prefix: string) => {
    const p = canon(prefix);
    for (const c of cols) {
      if (canon(c.header ?? '').startsWith(p)) return c.value?.trim() ?? '';
    }
    return '';
  };

  const lines: string[] = [];
  for (let n = 1; n <= 4; n++) {
    const first = findByPrefix(`Team member ${n} first name`);
    const last = findByPrefix(`Team member ${n} last name`);
    const email =
      findByPrefix(`Team member ${n} email`) ||
      findByPrefix(`Team member ${n} e-mail`);
    const name = `${first} ${last}`.trim();
    if (!name && !email) continue;
    lines.push(`${name || '(no name)'}${email ? ` — ${email}` : ''}`);
  }
  return lines;
}

export default function ProcessedTeamsTable({
  records,
  issues,
  rowContacts,
}: {
  records: ParsedRecord[];
  issues: CsvRowIssue[];
  rowContacts: CsvRowContact[];
}) {
  const [search, setSearch] = useState('');
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('status');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const issueMap = useMemo(() => {
    const byNum = new Map<number, CsvRowIssue>();
    const byName = new Map<string, CsvRowIssue>();
    for (const issue of issues) {
      if (issue.teamNumber != null && !isNaN(issue.teamNumber)) {
        const existing = byNum.get(issue.teamNumber);
        if (!existing || issue.severity === 'error')
          byNum.set(issue.teamNumber, issue);
      }
      if (issue.projectTitle) {
        const k = issue.projectTitle.toLowerCase();
        const existing = byName.get(k);
        if (!existing || issue.severity === 'error') byName.set(k, issue);
      }
    }
    return { byNum, byName };
  }, [issues]);

  const contactMap = useMemo(() => {
    const byNum = new Map<number, CsvRowContact>();
    const byName = new Map<string, CsvRowContact>();
    for (const c of rowContacts) {
      if (c.teamNumber != null && !isNaN(c.teamNumber))
        byNum.set(c.teamNumber, c);
      if (c.projectTitle) byName.set(c.projectTitle.toLowerCase(), c);
    }
    return { byNum, byName };
  }, [rowContacts]);

  const getIssue = (r: ParsedRecord) =>
    issueMap.byNum.get(r.teamNumber) ??
    issueMap.byName.get(r.name.toLowerCase());

  const getContact = (r: ParsedRecord) =>
    contactMap.byNum.get(r.teamNumber) ??
    contactMap.byName.get(r.name.toLowerCase());

  const getStatus = (r: ParsedRecord): RowStatus =>
    getIssue(r)?.severity ?? 'valid';

  const rowKey = (r: ParsedRecord) => `${r.teamNumber}-${r.name}`;

  const displayed = useMemo(() => {
    const q = search.toLowerCase();
    const filtered = records.filter(
      (r) => !q || JSON.stringify(r).toLowerCase().includes(q)
    );

    filtered.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'status') {
        cmp =
          STATUS_ORDER[
            issueMap.byNum.get(a.teamNumber)?.severity ??
              issueMap.byName.get(a.name.toLowerCase())?.severity ??
              'valid'
          ] -
          STATUS_ORDER[
            issueMap.byNum.get(b.teamNumber)?.severity ??
              issueMap.byName.get(b.name.toLowerCase())?.severity ??
              'valid'
          ];
      } else if (sortKey === 'teamNumber') {
        const aNum = Number.isFinite(a.teamNumber) ? a.teamNumber : 0;
        const bNum = Number.isFinite(b.teamNumber) ? b.teamNumber : 0;
        cmp = aNum - bNum;
      } else if (sortKey === 'tableNumber') {
        cmp = (a.tableNumber ?? '').localeCompare(
          b.tableNumber ?? '',
          undefined,
          {
            numeric: true,
          }
        );
      } else if (sortKey === 'name') {
        cmp = a.name.localeCompare(b.name);
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return filtered;
  }, [records, search, issueMap, sortKey, sortDir]);

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <span className="ml-1 opacity-30">↕</span>;
    return <span className="ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  };

  const thClass = (col: SortKey) =>
    `px-4 py-3 cursor-pointer select-none hover:text-gray-800 ${
      sortKey === col ? 'text-gray-800' : ''
    }`;

  return (
    <details className="py-2" open>
      <summary className="text-sm font-semibold cursor-pointer select-none py-1">
        Processed Teams ({records.length} total)
      </summary>

      <div className="mt-3">
        <input
          type="text"
          placeholder="Search by name, team #, table, track…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-3 w-full max-w-sm border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#005271]"
        />

        <div className="border border-gray-200 rounded-lg overflow-hidden w-full">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <th
                  className={thClass('status')}
                  onClick={() => handleSort('status')}
                >
                  Status
                  <SortIcon col="status" />
                </th>
                <th
                  className={thClass('teamNumber')}
                  onClick={() => handleSort('teamNumber')}
                >
                  Team #
                  <SortIcon col="teamNumber" />
                </th>
                <th
                  className={thClass('tableNumber')}
                  onClick={() => handleSort('tableNumber')}
                >
                  Table
                  <SortIcon col="tableNumber" />
                </th>
                <th
                  className={thClass('name')}
                  onClick={() => handleSort('name')}
                >
                  Project Name
                  <SortIcon col="name" />
                </th>
                <th className="px-4 py-3">Tracks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayed.map((r) => {
                const status = getStatus(r);
                const issue = getIssue(r);
                const contact = getContact(r);
                const key = rowKey(r);
                const isExpanded = expandedKey === key;
                const isWait = r.tableNumber?.startsWith('WAIT');
                const memberLines = contact ? buildMemberLines(contact) : [];

                return (
                  <React.Fragment key={key}>
                    <tr
                      className={`transition-colors cursor-pointer ${STATUS_ROW_BG[status]} hover:brightness-95`}
                      onClick={() => setExpandedKey(isExpanded ? null : key)}
                    >
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_PILL[status]}`}
                        >
                          {status === 'error'
                            ? 'Error'
                            : status === 'warning'
                            ? 'Warning'
                            : 'Valid'}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-gray-700">
                        {isNaN(r.teamNumber) ? '—' : r.teamNumber}
                      </td>
                      <td className="px-4 py-3 font-mono">
                        <span
                          className={
                            isWait
                              ? 'text-yellow-700 font-semibold'
                              : 'text-gray-700'
                          }
                        >
                          {r.tableNumber || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {r.name}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {r.tracks.map((t) => (
                            <span
                              key={t}
                              className="inline-flex px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-700 border border-gray-200"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr className={STATUS_ROW_BG[status]}>
                        <td
                          colSpan={5}
                          className="px-6 py-3 text-xs text-gray-600 border-t border-dashed border-gray-300"
                        >
                          <div className="flex flex-col gap-2">
                            {issue && (
                              <div className="flex flex-wrap gap-x-6 gap-y-1">
                                {issue.missingFields?.length > 0 && (
                                  <span>
                                    Missing:{' '}
                                    <strong>
                                      {issue.missingFields.join(', ')}
                                    </strong>
                                  </span>
                                )}
                                {issue.invalidTracks?.length > 0 && (
                                  <span>
                                    Invalid tracks:{' '}
                                    <strong>
                                      {issue.invalidTracks.join(', ')}
                                    </strong>
                                  </span>
                                )}
                                {issue.duplicateTeamNumber !== undefined && (
                                  <span>
                                    Duplicate team #:{' '}
                                    <strong>{issue.duplicateTeamNumber}</strong>
                                  </span>
                                )}
                                {issue.duplicateTracks?.length > 0 && (
                                  <span>
                                    Duplicate tracks:{' '}
                                    <strong>
                                      {issue.duplicateTracks.join(', ')}
                                    </strong>
                                  </span>
                                )}
                                {issue.excludedTracks?.length > 0 && (
                                  <span>
                                    Excluded:{' '}
                                    <strong>
                                      {issue.excludedTracks.join(', ')}
                                    </strong>
                                  </span>
                                )}
                                {issue.autoFixedTracks?.length > 0 && (
                                  <span>
                                    Auto-fixed:{' '}
                                    {issue.autoFixedTracks
                                      .map((f) => `${f.raw} → ${f.canonical}`)
                                      .join(', ')}
                                  </span>
                                )}
                              </div>
                            )}

                            {contact && (
                              <div className="flex flex-col gap-0.5">
                                {contact.contactNames?.length > 0 && (
                                  <span>
                                    <span className="font-semibold">
                                      Submitter:
                                    </span>{' '}
                                    {contact.contactNames.join(', ')}
                                    {contact.contactEmails?.length > 0 &&
                                      ` (${contact.contactEmails.join(', ')})`}
                                  </span>
                                )}
                                {memberLines.map((line, i) => (
                                  <span key={i}>
                                    <span className="font-semibold">
                                      Member {i + 1}:
                                    </span>{' '}
                                    {line}
                                  </span>
                                ))}
                              </div>
                            )}

                            {!issue && !contact && (
                              <span className="text-gray-400">
                                No details available.
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-400">
            {displayed.length} of {records.length} teams shown
          </div>
        </div>
      </div>
    </details>
  );
}
