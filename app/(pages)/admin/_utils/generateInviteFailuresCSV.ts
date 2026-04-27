import { InviteData, InviteResult } from '@typeDefs/emails';

function normalizeCell(value: string): string {
  return value.replace(/\r?\n+/g, ' ').trim();
}

function escapeCell(value: string): string {
  return `"${normalizeCell(value).replace(/"/g, '""')}"`;
}

export function buildFailureDownloadFilename(inputFileName: string): string {
  const trimmed = inputFileName.trim();
  if (!trimmed) return 'invite_failures.csv';

  const dotIndex = trimmed.lastIndexOf('.');
  if (dotIndex > 0) {
    return `${trimmed.slice(0, dotIndex)}_failures${trimmed.slice(dotIndex)}`;
  }

  return `${trimmed}_failures.csv`;
}

export function generateInviteFailuresCSV(
  rows: InviteData[],
  results: InviteResult[]
): string {
  const resultMap = new Map(
    results.map((result) => [result.email.toLowerCase(), result])
  );

  const headers = ['First Name', 'Last Name', 'Email', 'Failures'];
  const csvRows = rows.map((row) => {
    const result = resultMap.get(row.email.toLowerCase());
    const failureReason = result?.success
      ? ''
      : result?.error ?? 'Unknown error';

    return [row.firstName, row.lastName, row.email, failureReason]
      .map(escapeCell)
      .join(',');
  });

  return [headers.join(','), ...csvRows].join('\n');
}
