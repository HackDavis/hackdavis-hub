export interface InviteResultRow {
  firstName: string;
  lastName: string;
  email: string;
  titoUrl?: string;
  hubUrl?: string; // populated for hacker invites; omitted for mentor-only
  success: boolean;
  error?: string;
}

function escapeCell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

/**
 * Generates a CSV string from bulk invite results.
 * @param rows     Merged invite result rows (one per person).
 * @param includeHub  Set true for hacker invites that include a Hub URL column.
 */
export function generateInviteResultsCSV(
  rows: InviteResultRow[],
  includeHub = false
): string {
  const headers = [
    'Email',
    'First Name',
    'Last Name',
    'Tito Invite URL',
    ...(includeHub ? ['Hub Invite URL'] : []),
    'Success',
    'Notes',
  ];

  const csvRows = rows.map((row) => {
    const cells = [
      row.email,
      row.firstName,
      row.lastName,
      row.titoUrl ?? '',
      ...(includeHub ? [row.hubUrl ?? ''] : []),
      row.success ? 'TRUE' : 'FALSE',
      row.success ? '' : (row.error ?? 'Unknown error'),
    ];
    return cells.map(escapeCell).join(',');
  });

  return [headers.join(','), ...csvRows].join('\n');
}
