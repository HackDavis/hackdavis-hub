import { generateInviteFailuresCSV } from '../app/(pages)/admin/_utils/generateInviteFailuresCSV';
import { InviteData, InviteResult } from '@typeDefs/emails';

describe('generateInviteFailuresCSV', () => {
  it('includes only failed rows and excludes successful invites', () => {
    const rows: InviteData[] = [
      { firstName: 'Alice', lastName: 'Smith', email: 'alice@example.com' },
      { firstName: 'Bob', lastName: 'Jones', email: 'bob@example.com' },
    ];

    const results: InviteResult[] = [
      { email: 'alice@example.com', success: true },
      { email: 'bob@example.com', success: false, error: 'Bounced' },
    ];

    const csv = generateInviteFailuresCSV(rows, results);
    const lines = csv.split('\n');

    // Header + one failed row
    expect(lines[0]).toBe('First Name,Last Name,Email,Failure');
    expect(lines).toHaveLength(2);

    // Successful row should not be present
    expect(csv).not.toContain('alice@example.com');

    // Failed row should be present with the error message
    expect(csv).toContain('bob@example.com');
    expect(csv).toContain('Bounced');
  });

  it('neutralizes spreadsheet formulas in exported cells', () => {
    const rows: InviteData[] = [
      {
        firstName: '=Alice',
        lastName: '+Jones',
        email: 'danger@example.com',
      },
    ];

    const results: InviteResult[] = [
      {
        email: 'danger@example.com',
        success: false,
        error: '@cmd',
      },
    ];

    const csv = generateInviteFailuresCSV(rows, results);

    expect(csv).toContain('"\'=Alice"');
    expect(csv).toContain('"\'+Jones"');
    expect(csv).toContain('"\'@cmd"');
  });
});
