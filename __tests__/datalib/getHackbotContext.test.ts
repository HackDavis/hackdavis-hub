/** @jest-environment node */

import { retrieveContext } from '@datalib/hackbot/getHackbotContext';
import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import { embedText } from '@utils/hackbot/embedText';
import { retryWithBackoff } from '@utils/hackbot/retryWithBackoff';

jest.mock('@utils/mongodb/mongoClient.mjs', () => ({
  getDatabase: jest.fn(),
}));

jest.mock('@utils/hackbot/embedText', () => ({
  embedText: jest.fn(),
}));

jest.mock('@utils/hackbot/retryWithBackoff', () => ({
  retryWithBackoff: jest.fn(),
}));

const mockGetDatabase = getDatabase as jest.MockedFunction<typeof getDatabase>;
const mockEmbedText = embedText as jest.MockedFunction<typeof embedText>;
const mockRetryWithBackoff = retryWithBackoff as jest.MockedFunction<
  typeof retryWithBackoff
>;

describe('retrieveContext', () => {
  const aggregateToArray = jest.fn();
  const aggregate = jest.fn(() => ({ toArray: aggregateToArray }));
  const collection = jest.fn(() => ({ aggregate }));

  beforeEach(() => {
    jest.clearAllMocks();

    mockRetryWithBackoff.mockImplementation(async (operation: any) =>
      operation()
    );
    mockEmbedText.mockResolvedValue([0.1, 0.2, 0.3]);
    mockGetDatabase.mockResolvedValue({ collection } as any);
    aggregateToArray.mockResolvedValue([
      {
        _id: 'doc-1',
        type: 'general',
        title: 'Doc 1',
        text: 'Some useful context',
        url: 'https://example.com',
      },
    ]);
  });

  it('uses adaptive simple limit for greetings', async () => {
    await retrieveContext('hello');

    const pipeline = aggregate.mock.calls[0][0];
    expect(pipeline[0].$vectorSearch.limit).toBe(5);
  });

  it('uses adaptive complex limit for schedule/list queries', async () => {
    await retrieveContext('show me all events this weekend');

    const pipeline = aggregate.mock.calls[0][0];
    expect(pipeline[0].$vectorSearch.limit).toBe(30);
  });

  it('honors explicit limit when provided', async () => {
    await retrieveContext('what is hacking', { limit: 7 });

    const pipeline = aggregate.mock.calls[0][0];
    expect(pipeline[0].$vectorSearch.limit).toBe(7);
  });

  it('adds preferredTypes filter when provided', async () => {
    await retrieveContext('schedule', {
      preferredTypes: ['schedule', 'general'] as any,
    });

    const pipeline = aggregate.mock.calls[0][0];
    expect(pipeline[0].$vectorSearch.filter).toEqual({
      type: { $in: ['schedule', 'general'] },
    });
  });

  it('projects only fields needed by downstream code', async () => {
    await retrieveContext('where is check-in?');

    const pipeline = aggregate.mock.calls[0][0];
    expect(pipeline[1]).toEqual({
      $project: {
        _id: 1,
        type: 1,
        title: 1,
        text: 1,
        url: 1,
      },
    });
  });
});
