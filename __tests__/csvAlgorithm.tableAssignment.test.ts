import { validateCsvBlob } from '@utils/csv-ingestion/csvAlgorithm';

type TeamRow = {
  tableNumber: number;
  projectTitle: string;
  status: string;
  primaryTrack: string;
};

function buildCsv(rows: TeamRow[]): string {
  const header = [
    'Table Number',
    'Project Status',
    'Project Title',
    'Track #1 (Primary Track)',
    'Track #2',
    'Track #3',
    'Opt-In Prizes',
  ].join(',');

  const lines = rows.map((row) =>
    [
      String(row.tableNumber),
      row.status,
      row.projectTitle,
      row.primaryTrack,
      '',
      '',
      '',
    ].join(',')
  );

  return `${header}\n${lines.join('\n')}`;
}

describe('csvAlgorithm table assignment', () => {
  it('assigns the first hardware team to A1', async () => {
    const csv = buildCsv([
      {
        tableNumber: 1,
        status: 'Submitted',
        projectTitle: 'Hardware Team',
        primaryTrack: 'Best Hardware Hack',
      },
      {
        tableNumber: 2,
        status: 'Submitted',
        projectTitle: 'Other Team',
        primaryTrack: 'Best AI/ML Hack',
      },
    ]);

    const res = await validateCsvBlob(new Blob([csv], { type: 'text/csv' }));

    expect(res.ok).toBe(true);
    expect(res.body).not.toBeNull();

    const hardwareTeam = res.body?.find((t) => t.name === 'Hardware Team');
    expect(hardwareTeam?.tableNumber).toBe('A1');
  });

  it('starts floor 2 at I1 after floor 1 capacity is filled', async () => {
    // Floor 1: 8 rows * 13 seats = 104. Floor 2 starts at 105th team
    const rows: TeamRow[] = Array.from({ length: 105 }, (_, i) => ({
      tableNumber: i + 1,
      status: 'Submitted',
      projectTitle: `Team ${i + 1}`,
      primaryTrack: 'Best AI/ML Hack',
    }));

    const csv = buildCsv(rows);
    const res = await validateCsvBlob(new Blob([csv], { type: 'text/csv' }));

    if (!res.ok) {
      console.error('Unexpected error:', res.error);
    }
    expect(res.ok).toBe(true);
    expect(res.body).not.toBeNull();
    expect(res.body?.length).toBe(105);
    // Last team on floor 1
    expect(res.body?.[103].tableNumber).toBe('H13');
    // First team on floor 2
    expect(res.body?.[104].tableNumber).toBe('I1');
  });

  it('returns a validation error when team count exceeds venue capacity', async () => {
    // Total capacity: 104 (F1) + 60 (F2) = 164
    // We provide 167 teams to trigger the "WAIT-n" logic and the error message
    const rows: TeamRow[] = Array.from({ length: 167 }, (_, i) => ({
      tableNumber: i + 1,
      status: 'Submitted',
      projectTitle: `Team ${i + 1}`,
      primaryTrack: 'Best AI/ML Hack',
    }));

    const csv = buildCsv(rows);
    const res = await validateCsvBlob(new Blob([csv], { type: 'text/csv' }));

    // The Promise should now resolve (ok: false) instead of timing out
    expect(res.ok).toBe(false);

    // Verify the error message is passed to the Admin UI
    expect(res.error).toContain('Capacity Exceeded');
    expect(res.error).toContain('167 teams');
    expect(res.error).toContain('164 seats');

    // Verify that even with an error, the data was processed (no silent drops)
    expect(res.body).toHaveLength(167);

    // Verify the last team got a WAIT label
    const lastTeam = res.body?.[166];
    expect(lastTeam?.tableNumber).toBe('WAIT-3');
  });
});
