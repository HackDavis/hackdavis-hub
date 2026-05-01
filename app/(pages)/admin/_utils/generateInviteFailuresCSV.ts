import {
  InviteData,
  InviteResult,
  HackerAdmissionType,
} from '@typeDefs/emails';

export interface InviteDataWithType extends InviteData {
  admissionType?: HackerAdmissionType;
}

function normalizeCell(value: string): string {
  return value.replace(/\r?\n+/g, ' ').trim();
}

function neutralizeSpreadsheetFormula(value: string): string {
  return /^[=+\-@]/.test(value) ? `'${value}` : value;
}

function escapeCell(value: string): string {
  const normalized = normalizeCell(value);
  const safeValue = neutralizeSpreadsheetFormula(normalized);
  return `"${safeValue.replace(/"/g, '""')}"`;
}

export function buildFailureDownloadFilename(inputFileName: string): string {
  const trimmed = inputFileName.trim();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5); // YYYY-MM-DDTHH-MM-SS

  if (!trimmed) return `invite_failures_${timestamp}Z.csv`;

  const dotIndex = trimmed.lastIndexOf('.');
  if (dotIndex > 0) {
    return `${trimmed.slice(0, dotIndex)}_failures_${timestamp}Z${trimmed.slice(
      dotIndex
    )}`;
  }

  return `${trimmed}_failures_${timestamp}Z.csv`;
}

/**
 * Generates a CSV of failed rows only.
 *
 * When rows include an admissionType (hacker admissions), a Type column is
 * included so the file can be re-uploaded directly to retry failed sends.
 * The parsers skip any extra trailing columns, so the appended Failure column
 * does not interfere with re-uploading.
 */
export function generateInviteFailuresCSV(
  rows: InviteDataWithType[],
  results: InviteResult[]
): string {
  const resultMap = new Map(results.map((r) => [r.email.toLowerCase(), r]));

  const includeType = rows.some((r) => r.admissionType != null);
  const headers = [
    'First Name',
    'Last Name',
    'Email',
    ...(includeType ? ['Type'] : []),
    'Failure',
  ];

  const failedRows = rows.filter((row) => {
    const result = resultMap.get(row.email.toLowerCase());
    return !result?.success;
  });

  const csvRows = failedRows.map((row) => {
    const result = resultMap.get(row.email.toLowerCase());
    const failureReason = result?.error ?? 'Unknown error';

    return [
      row.firstName,
      row.lastName,
      row.email,
      ...(includeType ? [row.admissionType ?? ''] : []),
      failureReason,
    ]
      .map(escapeCell)
      .join(',');
  });

  return [headers.join(','), ...csvRows].join('\n');
}
