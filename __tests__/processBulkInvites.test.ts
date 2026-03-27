import processBulkInvites from '@actions/emails/processBulkInvites';
import { InviteData, InviteResult } from '@typeDefs/emails';

// Mock parseInviteCSV so we don't need csv-parse in the test environment
jest.mock('@actions/emails/parseInviteCSV', () => ({
  __esModule: true,
  default: jest.fn(),
}));

import parseInviteCSV from '@actions/emails/parseInviteCSV';
const mockParseCSV = parseInviteCSV as jest.MockedFunction<
  typeof parseInviteCSV
>;

const ALICE: InviteData = {
  firstName: 'Alice',
  lastName: 'Smith',
  email: 'alice@example.com',
};
const BOB: InviteData = {
  firstName: 'Bob',
  lastName: 'Jones',
  email: 'bob@example.com',
};
const CHARLIE: InviteData = {
  firstName: 'Charlie',
  lastName: 'Brown',
  email: 'charlie@example.com',
};

beforeEach(() => jest.clearAllMocks());

describe('processBulkInvites', () => {
  it('returns CSV parse error when CSV is invalid', async () => {
    mockParseCSV.mockReturnValue({ ok: false, error: 'CSV file is empty.' });

    const result = await processBulkInvites('', {
      label: 'Test',
      processOne: async (item) => ({
        email: item.email,
        success: true,
      }),
    });

    expect(result.ok).toBe(false);
    expect(result.error).toBe('CSV file is empty.');
    expect(result.results).toEqual([]);
    expect(result.successCount).toBe(0);
    expect(result.failureCount).toBe(0);
  });

  it('processes all items and returns success', async () => {
    mockParseCSV.mockReturnValue({ ok: true, body: [ALICE, BOB] });

    const result = await processBulkInvites('csv', {
      label: 'Test',
      processOne: async (item) => ({
        email: item.email,
        success: true,
      }),
    });

    expect(result.ok).toBe(true);
    expect(result.successCount).toBe(2);
    expect(result.failureCount).toBe(0);
    expect(result.error).toBeNull();
    expect(result.results).toHaveLength(2);
    expect(result.results.map((r) => r.email)).toEqual(
      expect.arrayContaining(['alice@example.com', 'bob@example.com'])
    );
  });

  it('handles processOne returning failure results', async () => {
    mockParseCSV.mockReturnValue({ ok: true, body: [ALICE, BOB] });

    const result = await processBulkInvites('csv', {
      label: 'Test',
      processOne: async (item) => ({
        email: item.email,
        success: item.email !== 'bob@example.com',
        error:
          item.email === 'bob@example.com' ? 'Something went wrong' : undefined,
      }),
    });

    expect(result.ok).toBe(false);
    expect(result.successCount).toBe(1);
    expect(result.failureCount).toBe(1);
    expect(result.error).toBe('1 invite(s) failed to send.');
  });

  it('catches exceptions thrown by processOne', async () => {
    mockParseCSV.mockReturnValue({ ok: true, body: [ALICE] });

    const result = await processBulkInvites('csv', {
      label: 'Test',
      processOne: async () => {
        throw new Error('network timeout');
      },
    });

    expect(result.ok).toBe(false);
    expect(result.failureCount).toBe(1);
    expect(result.results[0].error).toBe('network timeout');
  });

  it('uses preprocess to filter items and include early results', async () => {
    mockParseCSV.mockReturnValue({ ok: true, body: [ALICE, BOB, CHARLIE] });

    const processOne = jest.fn(
      async (item: InviteData): Promise<InviteResult> => ({
        email: item.email,
        success: true,
      })
    );

    const result = await processBulkInvites('csv', {
      label: 'Test',
      preprocess: async (items) => ({
        remaining: items.filter((i) => i.email !== 'bob@example.com'),
        earlyResults: [
          { email: 'bob@example.com', success: false, error: 'Duplicate' },
        ],
      }),
      processOne,
    });

    // Bob was filtered out by preprocess
    expect(processOne).toHaveBeenCalledTimes(2);
    expect(processOne).not.toHaveBeenCalledWith(
      expect.objectContaining({ email: 'bob@example.com' })
    );

    // Bob's early result is included
    expect(result.results).toHaveLength(3);
    expect(result.successCount).toBe(2);
    expect(result.failureCount).toBe(1);
    expect(result.ok).toBe(false);
  });

  it('respects concurrency limit', async () => {
    const items = Array.from({ length: 6 }, (_, i) => ({
      firstName: `User${i}`,
      lastName: `Last${i}`,
      email: `user${i}@example.com`,
    }));
    mockParseCSV.mockReturnValue({ ok: true, body: items });

    let maxConcurrent = 0;
    let currentConcurrent = 0;

    const result = await processBulkInvites('csv', {
      label: 'Test',
      concurrency: 2,
      processOne: async (item) => {
        currentConcurrent++;
        maxConcurrent = Math.max(maxConcurrent, currentConcurrent);
        await new Promise((r) => setTimeout(r, 20));
        currentConcurrent--;
        return { email: item.email, success: true };
      },
    });

    expect(maxConcurrent).toBeLessThanOrEqual(2);
    expect(result.successCount).toBe(6);
  });

  it('works without concurrency limit (all items fire at once)', async () => {
    const items = Array.from({ length: 5 }, (_, i) => ({
      firstName: `User${i}`,
      lastName: `Last${i}`,
      email: `user${i}@example.com`,
    }));
    mockParseCSV.mockReturnValue({ ok: true, body: items });

    let maxConcurrent = 0;
    let currentConcurrent = 0;

    const result = await processBulkInvites('csv', {
      label: 'Test',
      processOne: async (item) => {
        currentConcurrent++;
        maxConcurrent = Math.max(maxConcurrent, currentConcurrent);
        await new Promise((r) => setTimeout(r, 20));
        currentConcurrent--;
        return { email: item.email, success: true };
      },
    });

    // Without concurrency limit, all 5 should run at once
    expect(maxConcurrent).toBe(5);
    expect(result.successCount).toBe(5);
  });
});
