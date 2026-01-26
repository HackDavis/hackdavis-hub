import csv from 'csv-parser';
import trackData from '@data/db_validation_data.json' assert { type: 'json' };
import { Readable } from 'stream';
import ParsedRecord from '@typeDefs/parsedRecord';

const filteredTracks = [
  'Best Hack for Social Good',
  "Hacker's Choice Award",
  'N/A',
];

export type CsvTrackAutoFix = {
  raw: string;
  canonical: string;
};

export type CsvRowIssue = {
  rowIndex: number; // 1-based, counting CSV rows processed
  teamNumberRaw?: string;
  teamNumber?: number;
  projectTitle?: string;
  contactEmails: string[];
  contactNames: string[];
  memberEmails: string[];
  memberNames: string[];
  severity: 'error' | 'warning';
  invalidTracks: string[];
  excludedTracks: string[];
  duplicateTracks: string[];
  autoFixedTracks: CsvTrackAutoFix[];
  missingFields: string[];
  memberColumnsFromTeamMember1: Array<{ header: string; value: string }>;
};

export type CsvValidationReport = {
  totalTeamsParsed: number;
  validTeams: number;
  errorRows: number;
  warningRows: number;
  unknownTracks: string[];
  issues: CsvRowIssue[];
};

type TrackMatchCandidate = {
  canonical: string;
  normalized: string;
};

function normalizeTrackName(value: string): string {
  // Only do trimming and case-insensitive matching.
  return value.trim().toLowerCase();
}

const filteredTrackSet = new Set(filteredTracks.map(normalizeTrackName));

const validTracks: string[] = (trackData.tracks as string[]).filter(
  (t) => !filteredTrackSet.has(normalizeTrackName(t))
);

const trackCandidates: TrackMatchCandidate[] = validTracks.map((canonical) => ({
  canonical,
  normalized: normalizeTrackName(canonical),
}));

const normalizedToCanonical = new Map<string, string>();
for (const candidate of trackCandidates) {
  if (!normalizedToCanonical.has(candidate.normalized)) {
    normalizedToCanonical.set(candidate.normalized, candidate.canonical);
  }
}

export function matchCanonicalTrack(raw: string): string | null {
  const normalized = normalizeTrackName(raw);
  if (!normalized) return null;
  if (filteredTrackSet.has(normalized)) return null;

  const exact = normalizedToCanonical.get(normalized);
  if (exact) return exact;

  return null;
}

function splitOptInTracks(value: string): string[] {
  // CSV exports vary; tolerate commas/semicolons/pipes/newlines.
  return value
    .split(/[,;|\n\r]+/g)
    .map((t) => t.trim())
    .filter(Boolean);
}

function isSubmittedNonDraft(status: unknown): boolean {
  const s = String(status ?? '')
    .trim()
    .toLowerCase();
  if (!s) return false;
  if (s.includes('draft')) return false;
  return s.includes('submitted');
}

function extractContactInfoFromRow(data: Record<string, unknown>): {
  contactEmails: string[];
  contactNames: string[];
  memberEmails: string[];
  memberNames: string[];
} {
  const contactEmails = new Set<string>();
  const contactNames = new Set<string>();
  const memberEmails = new Set<string>();
  const memberNames = new Set<string>();

  const looksLikeUrl = (value: string) => /^https?:\/\//i.test(value);

  for (const [key, value] of Object.entries(data)) {
    const k = key.toLowerCase();
    const v = String(value ?? '').trim();
    if (!v) continue;

    const isTrackColumn =
      k.includes('track') || k.includes('opt-in') || k.includes('prize');
    const isProjectTitle = k.includes('project title');
    const isContactish =
      k.includes('contact') || k.includes('submitter') || k.includes('owner');

    if (k.includes('email') || k.includes('e-mail')) {
      v.split(/[\s,;|]+/g)
        .map((s) => s.trim())
        .filter(Boolean)
        .filter((s) => s.includes('@'))
        .forEach((email) => {
          memberEmails.add(email);
          if (isContactish) contactEmails.add(email);
        });
      continue;
    }

    // Names
    const isNameColumn = k.includes('name');
    const isMemberishColumn =
      k.includes('member') ||
      k.includes('teammate') ||
      k.includes('team member') ||
      k.includes('participant');
    const isProbablyNotAName =
      k.includes('school') ||
      k.includes('major') ||
      k.includes('diet') ||
      k.includes('shirt') ||
      k.includes('pronoun') ||
      k.includes('role') ||
      k.includes('github') ||
      k.includes('linkedin') ||
      k.includes('devpost') ||
      k.includes('portfolio') ||
      k.includes('phone');

    if (!isTrackColumn && !isProjectTitle && !looksLikeUrl(v)) {
      if (isNameColumn) {
        memberNames.add(v);
        if (isContactish) contactNames.add(v);
      } else if (isMemberishColumn && !isProbablyNotAName) {
        memberNames.add(v);
      }
    }
  }

  return {
    contactEmails: Array.from(contactEmails).sort(),
    contactNames: Array.from(contactNames).sort(),
    memberEmails: Array.from(memberEmails).sort(),
    memberNames: Array.from(memberNames).sort(),
  };
}

function canonicalHeaderKey(value: string): string {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

function extractMemberColumnsFromTeamMember1(
  data: Record<string, unknown>,
  headers: string[] | null,
  startIndex: number
): Array<{ header: string; value: string }> {
  if (!headers || startIndex < 0 || startIndex >= headers.length) return [];
  const rows: Array<{ header: string; value: string }> = [];
  for (let i = startIndex; i < headers.length; i += 1) {
    const header = headers[i];
    rows.push({ header, value: String(data[header] ?? '').trim() });
  }
  return rows;
}

function validateAndCanonicalizeTracks(rawTracks: string[]): {
  canonicalTracks: string[];
  invalidTracks: string[];
  excludedTracks: string[];
  duplicateTracks: string[];
  autoFixedTracks: CsvTrackAutoFix[];
} {
  const canonicalTracks: string[] = [];
  const invalidTracks: string[] = [];
  const excludedTracks: string[] = [];
  const duplicateTracks: string[] = [];
  const autoFixedTracks: CsvTrackAutoFix[] = [];

  const seen = new Set<string>();
  const excludedSet = new Set(filteredTracks.map((t) => normalizeTrackName(t)));
  const silentlyIgnoredSet = new Set(['n/a']);

  for (const raw of rawTracks) {
    const trimmed = String(raw ?? '').trim();
    if (!trimmed) continue;

    const normalized = normalizeTrackName(trimmed);
    if (silentlyIgnoredSet.has(normalized)) continue;

    if (excludedSet.has(normalized)) {
      excludedTracks.push(trimmed);
      continue;
    }

    const canonical = matchCanonicalTrack(trimmed);
    if (!canonical) {
      invalidTracks.push(trimmed);
      continue;
    }

    if (seen.has(canonical)) {
      duplicateTracks.push(canonical);
      continue;
    }

    if (trimmed !== canonical) {
      autoFixedTracks.push({ raw: trimmed, canonical });
    }

    seen.add(canonical);
    canonicalTracks.push(canonical);
  }

  return {
    canonicalTracks,
    invalidTracks,
    excludedTracks,
    duplicateTracks,
    autoFixedTracks,
  };
}

function validateTracksFromColumns(
  track1: string,
  track2: string,
  track3: string,
  optIns: string
): {
  canonicalTracks: string[];
  invalidTracks: string[];
  excludedTracks: string[];
  duplicateTracks: string[];
  autoFixedTracks: CsvTrackAutoFix[];
} {
  const primaryRaw = [track1, track2, track3];
  const optInRaw = splitOptInTracks(optIns);

  // First pass: validate primary tracks.
  const primary = validateAndCanonicalizeTracks(primaryRaw);

  // Second pass: validate opt-ins, but *ignore* entries that merely repeat a primary track.
  const optIn = validateAndCanonicalizeTracks(optInRaw);

  const primarySet = new Set(primary.canonicalTracks);
  const mergedTracks: string[] = [...primary.canonicalTracks];
  const mergedSeen = new Set(mergedTracks);

  for (const t of optIn.canonicalTracks) {
    if (mergedSeen.has(t)) continue;
    mergedTracks.push(t);
    mergedSeen.add(t);
  }

  // Duplicates:
  // - keep duplicates inside primary columns
  // - keep duplicates inside opt-in list
  // - DO NOT report duplicates that are just opt-in repeating a primary track
  const optInDuplicatesNotInPrimary = optIn.duplicateTracks.filter(
    (t) => !primarySet.has(t)
  );

  return {
    canonicalTracks: mergedTracks,
    invalidTracks: [...primary.invalidTracks, ...optIn.invalidTracks],
    excludedTracks: [...primary.excludedTracks, ...optIn.excludedTracks],
    duplicateTracks: [
      ...primary.duplicateTracks,
      ...optInDuplicatesNotInPrimary,
    ],
    autoFixedTracks: [...primary.autoFixedTracks, ...optIn.autoFixedTracks],
  };
}

export function sortTracks(
  track1: string,
  track2: string,
  track3: string,
  chosentracks: string
): string[] {
  const ordered: string[] = [];
  const seen = new Set<string>();

  const maybeAdd = (raw: string) => {
    const canonical = matchCanonicalTrack(raw);
    if (!canonical) return;
    if (seen.has(canonical)) return;
    ordered.push(canonical);
    seen.add(canonical);
  };

  [track1, track2, track3].forEach(maybeAdd);

  if (chosentracks && chosentracks.trim().length > 0) {
    for (const optIn of splitOptInTracks(chosentracks)) {
      maybeAdd(optIn);
    }
  }

  return ordered;
}

export async function validateCsvBlob(blob: Blob): Promise<{
  ok: boolean;
  body: ParsedRecord[] | null;
  validBody: ParsedRecord[] | null;
  report: CsvValidationReport;
  error: string | null;
}> {
  const issues: CsvRowIssue[] = [];
  const unknownTrackSet = new Set<string>();
  const output: ParsedRecord[] = [];

  try {
    const results = await new Promise<ParsedRecord[]>((resolve, reject) => {
      let rowIndex = 0;
      let headers: string[] | null = null;
      let teamMember1StartIndex = -1;

      const parseBlob = async () => {
        const buffer = Buffer.from(await blob.arrayBuffer());
        const stream = Readable.from(buffer.toString());

        stream
          .pipe(csv())
          .on('headers', (h: string[]) => {
            headers = h;
            const target = canonicalHeaderKey('Team member 1 first name');
            teamMember1StartIndex = h.findIndex(
              (header) => canonicalHeaderKey(header) === target
            );
          })
          .on('data', (data) => {
            rowIndex += 1;

            if (
              data['Table Number'] !== '' &&
              isSubmittedNonDraft(data['Project Status'])
            ) {
              const projectTitle = data['Project Title'];
              const tableNumberRaw = data['Table Number'];
              const parsedTeamNumber = parseInt(tableNumberRaw);

              const { contactEmails, contactNames, memberEmails, memberNames } =
                extractContactInfoFromRow(data);

              const memberColumnsFromTeamMember1 =
                extractMemberColumnsFromTeamMember1(
                  data,
                  headers,
                  teamMember1StartIndex
                );

              const track1 = data['Track #1 (Primary Track)'] ?? '';
              const track2 = data['Track #2'] ?? '';
              const track3 = data['Track #3'] ?? '';
              const optIns = data['Opt-In Prizes'] ?? '';

              const {
                canonicalTracks,
                invalidTracks,
                excludedTracks,
                duplicateTracks,
                autoFixedTracks,
              } = validateTracksFromColumns(track1, track2, track3, optIns);

              invalidTracks.forEach((t) => unknownTrackSet.add(t));

              const missingFields: string[] = [];
              if (!projectTitle || String(projectTitle).trim().length === 0) {
                missingFields.push('Project Title');
              }
              if (!Number.isFinite(parsedTeamNumber)) {
                missingFields.push('Table Number');
              }
              if (canonicalTracks.length === 0) {
                missingFields.push('Tracks');
              }

              if (
                invalidTracks.length > 0 ||
                missingFields.length > 0 ||
                excludedTracks.length > 0 ||
                duplicateTracks.length > 0 ||
                autoFixedTracks.length > 0
              ) {
                const severity =
                  invalidTracks.length > 0 || missingFields.length > 0
                    ? 'error'
                    : 'warning';
                issues.push({
                  rowIndex,
                  teamNumberRaw: tableNumberRaw,
                  teamNumber: Number.isFinite(parsedTeamNumber)
                    ? parsedTeamNumber
                    : undefined,
                  projectTitle,
                  contactEmails,
                  contactNames,
                  memberEmails,
                  memberNames,
                  severity,
                  invalidTracks,
                  excludedTracks,
                  duplicateTracks,
                  autoFixedTracks,
                  missingFields,
                  memberColumnsFromTeamMember1,
                });
              }

              output.push({
                name: projectTitle,
                teamNumber: parsedTeamNumber,
                tableNumber: 0, // assigned after ordering
                tracks: canonicalTracks,
                active: true,
              });
            }
          })
          .on('end', () => {
            const bestHardwareTeams = output.filter((team) =>
              team.tracks.includes('Best Hardware Hack')
            );
            const otherTeams = output.filter(
              (team) => !team.tracks.includes('Best Hardware Hack')
            );

            const orderedTeams = [...bestHardwareTeams, ...otherTeams];

            orderedTeams.forEach((team, index) => {
              team.tableNumber = index + 1;
            });

            resolve(orderedTeams);
          })
          .on('error', (error) => reject(error));
      };

      parseBlob().catch(reject);
    });

    const errorRows = issues.filter((i) => i.severity === 'error').length;
    const warningRows = issues.filter((i) => i.severity === 'warning').length;

    const errorTeamNumbers = new Set(
      issues
        .filter((i) => i.severity === 'error' && i.teamNumber !== undefined)
        .map((i) => i.teamNumber as number)
    );
    const validBody = results.filter(
      (t) => !errorTeamNumbers.has(t.teamNumber)
    );

    const report: CsvValidationReport = {
      totalTeamsParsed: results.length,
      validTeams: validBody.length,
      errorRows,
      warningRows,
      unknownTracks: Array.from(unknownTrackSet).sort(),
      issues,
    };

    const ok = report.errorRows === 0;
    return {
      ok,
      body: results,
      validBody,
      report,
      error: ok ? null : 'CSV validation failed. Fix errors and re-validate.',
    };
  } catch (e) {
    const error = e as Error;
    const report: CsvValidationReport = {
      totalTeamsParsed: 0,
      validTeams: 0,
      errorRows: 0,
      warningRows: 0,
      unknownTracks: [],
      issues: [],
    };
    return {
      ok: false,
      body: null,
      validBody: null,
      report,
      error: error.message,
    };
  }
}

export default async function csvAlgorithm(
  blob: Blob
): Promise<{ ok: boolean; body: ParsedRecord[] | null; error: string | null }> {
  try {
    const validated = await validateCsvBlob(blob);
    if (!validated.ok) {
      return { ok: false, body: null, error: validated.error };
    }

    return { ok: true, body: validated.body, error: null };
  } catch (e) {
    const error = e as Error;
    return { ok: false, body: null, error: error.message };
  }
}
