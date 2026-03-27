import parseInviteCSV from '@actions/emails/parseInviteCSV';

describe('parseInviteCSV', () => {
  it('parses valid CSV with header row', () => {
    const csv =
      'First Name,Last Name,Email\n' +
      'Alice,Smith,alice@example.com\n' +
      'Bob,Jones,bob@example.com\n';

    const result = parseInviteCSV(csv);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.body).toEqual([
      { firstName: 'Alice', lastName: 'Smith', email: 'alice@example.com' },
      { firstName: 'Bob', lastName: 'Jones', email: 'bob@example.com' },
    ]);
  });

  it('parses valid CSV without header row', () => {
    const csv = 'Alice,Smith,alice@example.com\nBob,Jones,bob@example.com\n';

    const result = parseInviteCSV(csv);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.body).toHaveLength(2);
    expect(result.body[0].firstName).toBe('Alice');
  });

  it('detects header with "email" keyword', () => {
    const csv = 'name_first,name_last,email\nAlice,Smith,alice@example.com\n';

    const result = parseInviteCSV(csv);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.body).toHaveLength(1);
  });

  it('detects header with "first" keyword', () => {
    const csv = 'First,Last,Contact\nAlice,Smith,alice@example.com\n';

    const result = parseInviteCSV(csv);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.body).toHaveLength(1);
  });

  it('returns error for empty CSV', () => {
    const result = parseInviteCSV('');
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toBe('CSV file is empty.');
  });

  it('returns error for whitespace-only CSV', () => {
    const result = parseInviteCSV('   \n  \n  ');
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toBe('CSV file is empty.');
  });

  it('returns error for header-only CSV', () => {
    const csv = 'First Name,Last Name,Email\n';

    const result = parseInviteCSV(csv);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toBe('CSV has a header but no data rows.');
  });

  it('returns error when row has fewer than 3 columns', () => {
    const csv = 'First Name,Last Name,Email\nAlice,Smith\n';

    const result = parseInviteCSV(csv);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toMatch(/expect(ed)? 3/i);
  });

  it('returns error for empty first name', () => {
    const csv = 'First Name,Last Name,Email\n,Smith,alice@example.com\n';

    const result = parseInviteCSV(csv);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain('First Name is empty');
  });

  it('returns error for empty last name', () => {
    const csv = 'First Name,Last Name,Email\nAlice,,alice@example.com\n';

    const result = parseInviteCSV(csv);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain('Last Name is empty');
  });

  it('returns error for invalid email', () => {
    const csv = 'First Name,Last Name,Email\nAlice,Smith,not-an-email\n';

    const result = parseInviteCSV(csv);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain('not a valid email');
  });

  it('collects multiple row errors', () => {
    const csv =
      'First Name,Last Name,Email\n' +
      ',Smith,alice@example.com\n' +
      'Bob,,bob@example.com\n' +
      'Charlie,Brown,bad-email\n';

    const result = parseInviteCSV(csv);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    const errors = result.error.split('\n');
    expect(errors).toHaveLength(3);
    expect(errors[0]).toContain('Row 2');
    expect(errors[1]).toContain('Row 3');
    expect(errors[2]).toContain('Row 4');
  });

  it('trims whitespace from values', () => {
    const csv = '  Alice  ,  Smith  ,  alice@example.com  \n';

    const result = parseInviteCSV(csv);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.body[0]).toEqual({
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@example.com',
    });
  });

  it('skips empty lines', () => {
    const csv =
      'First Name,Last Name,Email\n' +
      '\n' +
      'Alice,Smith,alice@example.com\n' +
      '\n' +
      'Bob,Jones,bob@example.com\n';

    const result = parseInviteCSV(csv);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.body).toHaveLength(2);
  });

  it('handles extra columns gracefully', () => {
    const csv =
      'First Name,Last Name,Email,Phone\n' +
      'Alice,Smith,alice@example.com,555-1234\n';

    const result = parseInviteCSV(csv);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.body[0]).toEqual({
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@example.com',
    });
  });

  it('handles quoted fields with commas', () => {
    const csv =
      'First Name,Last Name,Email\n' + '"Alice, Jr.",Smith,alice@example.com\n';

    const result = parseInviteCSV(csv);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.body[0].firstName).toBe('Alice, Jr.');
  });

  it('row numbers are correct without header', () => {
    const csv = 'Alice,Smith,alice@example.com\n,Jones,bob@example.com\n';

    const result = parseInviteCSV(csv);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain('Row 2');
  });
});
