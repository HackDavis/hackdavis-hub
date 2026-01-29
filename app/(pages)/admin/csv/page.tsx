'use client';
import validateCSV from '@actions/logic/validateCSV';
import ingestTeams from '@actions/logic/ingestTeams';
import checkTeamsPopulated from '@actions/logic/checkTeamsPopulated';
import React, { useEffect, useState } from 'react';

type ValidationResponse = {
  ok: boolean;
  body: any;
  validBody: any;
  report: any;
  error: string | null;
};

export default function CsvIngestion() {
  const [pending, setPending] = useState(false);
  const [validating, setValidating] = useState(false);
  const [response, setResponse] = useState('');
  const [validation, setValidation] = useState<ValidationResponse | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const [teamsAlreadyPopulated, setTeamsAlreadyPopulated] = useState<{
    populated: boolean;
    count: number;
  } | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = (await checkTeamsPopulated()) as {
          populated: boolean;
          count: number;
        };
        if (alive) setTeamsAlreadyPopulated(res);
      } catch {
        // non-blocking
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const validateHandler = async () => {
    if (!file) {
      setResponse('Please choose a CSV file first.');
      return;
    }
    setValidating(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = (await validateCSV(formData)) as ValidationResponse;
      setValidation(res);
      setResponse("");
    } catch (error) {
      console.error("Error validating CSV file:", error);
      setResponse("An error occurred while validating the CSV file. Please try again.");
    } finally {
      setValidating(false);
    }
  };

  const uploadValidHandler = async () => {
    if (!validation?.validBody) return;
    setPending(true);
    try {
      const res = await ingestTeams(validation.validBody);
      setResponse(JSON.stringify(res, null, 2));
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred during upload.";
      setResponse(`Error uploading teams: ${message}`);
    } finally {
      setPending(false);
    }
  };

  const uploadAllHandler = async () => {
    if (!validation?.body) return;

    const errors = validation.report?.errorRows ?? 0;
    if (errors > 0) {
      const ok = window.confirm(
        `There are ${errors} error rows. Force upload ALL teams anyway?`
      );
      if (!ok) return;
    }

    setPending(true);
    const res = await ingestTeams(validation.body);
    setResponse(JSON.stringify(res, null, 2));
    setPending(false);
  };

  const canonKey = (value: string) =>
    String(value ?? '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');

  const buildTeamMemberLines = (issue: any): string[] => {
    const cols = Array.isArray(issue?.memberColumnsFromTeamMember1)
      ? issue.memberColumnsFromTeamMember1
      : [];

    const findByHeaderPrefix = (prefix: string): string => {
      const p = canonKey(prefix);
      for (const c of cols) {
        const header = String(c?.header ?? '');
        const value = String(c?.value ?? '').trim();
        if (!header) continue;
        const hk = canonKey(header);
        if (hk.startsWith(p)) return value;
      }
      return '';
    };

    const lines: string[] = [];
    for (let n = 1; n <= 4; n += 1) {
      const first = findByHeaderPrefix(`Team member ${n} first name`);
      const last = findByHeaderPrefix(`Team member ${n} last name`);
      const email =
        findByHeaderPrefix(`Team member ${n} email`) ||
        findByHeaderPrefix(`Team member ${n} e-mail`);

      const fullName = `${first} ${last}`.trim().replace(/\s+/g, ' ');
      if (!fullName && !email) continue;

      const namePart = fullName || '(no name)';
      const emailPart = email ? ` — ${email}` : '';
      lines.push(`${namePart}${emailPart}`);
    }

    return lines;
  };

  const buildCopyText = (severity: 'error' | 'warning') => {
    if (!validation?.report) return '';

    const rows = validation.report.issues
      .filter((i: any) => i.severity === severity)
      .map((i: any) => {
        const header = `Team ${i.teamNumberRaw} — ${i.projectTitle}`;

        const submitterName = i.contactNames?.length
          ? `Submitter: ${i.contactNames.join(', ')}`
          : '';
        const submitterEmail = i.contactEmails?.length
          ? `Submitter Email: ${i.contactEmails.join(', ')}`
          : '';

        const memberLines = buildTeamMemberLines(i);
        const membersBlock = memberLines.length
          ? ['Members:', ...memberLines.map((l) => `  ${l}`)].join('\n')
          : '';

        return [header, submitterName, submitterEmail, membersBlock]
          .filter(Boolean)
          .join('\n');
      });

    return rows.join('\n\n');
  };

  const copyToClipboard = async (text: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setResponse('Copied to clipboard.');
    } catch {
      setResponse(text);
    }
  };

  return (
    <div>
      {teamsAlreadyPopulated?.populated ? (
        <div className="mb-4 rounded border border-red-500 bg-red-50 p-3 text-red-800">
          <div className="font-semibold">Teams database already populated</div>
          <div className="text-sm">
            Found {teamsAlreadyPopulated.count} existing team records. Uploading
            again may create duplicates.
          </div>
        </div>
      ) : null}
      <div>
        <h4>Upload CSV:</h4>
        <p className="text-sm opacity-80">
          Step 1: Validate the CSV and review issues. Step 2: Upload to insert
          teams.
        </p>

        <div className="flex flex-col py-4 gap-2">
          <input
            type="file"
            accept=".csv"
            onChange={(e) => {
              const next = e.target.files?.[0] ?? null;
              setFile(next);
              setValidation(null);
              setResponse('');
            }}
          />

          <button onClick={validateHandler} disabled={validating || pending}>
            {validating ? 'Validating...' : 'Validate'}
          </button>

          <button
            type="button"
            onClick={() => {
              setFile(null);
              setValidation(null);
              setResponse('');
            }}
            disabled={validating || pending}
          >
            Reset
          </button>
        </div>

        {validation?.report && (
          <div className="py-2">
            <h4>Validation Results</h4>
            <p className="text-sm opacity-80">
              Parsed: {validation.report.totalTeamsParsed} teams. Valid:{' '}
              {validation.report.validTeams}. Errors:{' '}
              {validation.report.errorRows}. Warnings:{' '}
              {validation.report.warningRows}.
            </p>

            {validation.report.errorRows > 0 && (
              <div className="py-2">
                <h4>Errors</h4>
                <button
                  className="text-sm"
                  onClick={() => copyToClipboard(buildCopyText('error'))}
                >
                  Copy Errors + Contact Info
                </button>
                <ul className="text-sm list-disc pl-6">
                  {validation.report.issues
                    .filter((i: any) => i.severity === 'error')
                    .map((i: any) => {
                      const memberLines = buildTeamMemberLines(i);

                      return (
                        <li key={`${i.rowIndex}-${i.teamNumberRaw}`}>
                          Team {i.teamNumberRaw} — {i.projectTitle}
                          {i.contactNames?.length ? (
                            <> (Submitter: {i.contactNames.join(", ")})</>
                          ) : null}
                          {i.missingFields?.length ? (
                            <> (Missing: {i.missingFields.join(", ")})</>
                          ) : null}
                          {i.invalidTracks?.length ? (
                            <> (Invalid tracks: {i.invalidTracks.join(", ")})</>
                          ) : null}
                          {memberLines.length ? (
                            <pre className="mt-2 text-xs whitespace-pre-wrap break-words">
                              {memberLines
                                .map((l) => `Member: ${l}`)
                                .join("\n")}
                            </pre>
                          ) : null}
                        </li>
                      );
                    })}
                </ul>
              </div>
            )}

            {validation.report.warningRows > 0 && (
              <div className="py-2">
                <h4>Warnings</h4>
                <button
                  className="text-sm"
                  onClick={() => copyToClipboard(buildCopyText('warning'))}
                >
                  Copy Warnings + Contact Info
                </button>
                <ul className="text-sm list-disc pl-6">
                  {validation.report.issues
                    .filter((i: any) => i.severity === 'warning')
                    .map((i: any) => (
                      <li key={`${i.rowIndex}-${i.teamNumberRaw}`}>
                        Team {i.teamNumberRaw} — {i.projectTitle}
                        {i.contactNames?.length ? (
                          <> (Submitter: {i.contactNames.join(', ')})</>
                        ) : null}
                        {i.duplicateTracks?.length ? (
                          <> (Duplicates: {i.duplicateTracks.join(', ')})</>
                        ) : null}
                        {i.excludedTracks?.length ? (
                          <> (Excluded: {i.excludedTracks.join(', ')})</>
                        ) : null}
                        {i.autoFixedTracks?.length ? (
                          <> (Auto-fixed casing/spacing)</>
                        ) : null}
                        {buildTeamMemberLines(i).length ? (
                          <pre className="mt-2 text-xs whitespace-pre-wrap break-words">
                            {buildTeamMemberLines(i)
                              .map((l) => `Member: ${l}`)
                              .join('\n')}
                          </pre>
                        ) : null}
                      </li>
                    ))}
                </ul>
              </div>
            )}

            <details className="py-2">
              <summary className="text-sm opacity-80">
                Raw report (JSON)
              </summary>
              <pre className="text-xs whitespace-pre-wrap break-words">
                {JSON.stringify(validation.report, null, 2)}
              </pre>
            </details>
          </div>
        )}

        {validation?.report && (
          <div className="flex flex-col py-2 gap-2">
            <button
              onClick={uploadValidHandler}
              disabled={pending || validating || !validation.validBody?.length}
            >
              {pending ? 'Uploading...' : 'Upload Valid Teams Only'}
            </button>

            <button
              onClick={uploadAllHandler}
              disabled={pending || validating || !validation.body?.length}
            >
              Force Upload All Teams (Ignore Errors)
            </button>
          </div>
        )}

        <pre className="text-xs whitespace-pre-wrap break-words">
          {pending ? 'parsing CSV and creating teams...' : response}
        </pre>
      </div>
    </div>
  );
}
