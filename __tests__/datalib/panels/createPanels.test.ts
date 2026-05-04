jest.mock('@data/tracks', () => ({
  __esModule: true,
  judgeVisibleTracks: {
    'Best AI/ML Hack': {
      name: 'Best AI/ML Hack',
      domain: 'aiml',
      domainDisplayName: 'Data Science or AI/ML',
    },
    'Most Technically Challenging Hack': {
      name: 'Most Technically Challenging Hack',
      domain: 'swe',
      domainDisplayName: 'Software Engineering',
    },
  },
}));

jest.mock('@utils/mongodb/mongoClient.mjs', () => ({
  __esModule: true,
  getDatabase: jest.fn(),
}));

jest.mock('@utils/request/isBodyEmpty', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@utils/request/parseAndReplace', () => ({
  __esModule: true,
  default: jest.fn(),
}));

import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import isBodyEmpty from '@utils/request/isBodyEmpty';
import parseAndReplace from '@utils/request/parseAndReplace';
import { CreateManyPanels, CreatePanel } from '@datalib/panels/createPanels';

const mockGetDatabase = getDatabase as jest.MockedFunction<typeof getDatabase>;
const mockIsBodyEmpty = isBodyEmpty as jest.MockedFunction<typeof isBodyEmpty>;
const mockParseAndReplace = parseAndReplace as jest.MockedFunction<
  typeof parseAndReplace
>;

describe('createPanels', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('allows creating a panel for a judge-visible sponsored track', async () => {
    const findOne = jest
      .fn()
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({
        track: 'Best AI/ML Hack',
        domain: 'aiml',
        user_ids: [],
      });
    const insertOne = jest.fn().mockResolvedValue({
      acknowledged: true,
      insertedId: 'panel-1',
    });
    mockGetDatabase.mockResolvedValue({
      collection: jest.fn().mockReturnValue({
        findOne,
        insertOne,
      }),
    } as any);

    const result = await CreatePanel('Best AI/ML Hack');

    expect(result.ok).toBe(true);
    expect(insertOne).toHaveBeenCalledWith({
      track: 'Best AI/ML Hack',
      domain: 'aiml',
      user_ids: [],
    });
    expect(result.body).toEqual({
      track: 'Best AI/ML Hack',
      domain: 'aiml',
      user_ids: [],
    });
  });

  it('rejects non-judge-visible sponsor tracks', async () => {
    const result = await CreatePanel('Best Hack for ASUCD Pantry');

    expect(result.ok).toBe(false);
    expect(result.error).toContain('Invalid track: Best Hack for ASUCD Pantry');
    expect(mockGetDatabase).not.toHaveBeenCalled();
  });

  it('creates many panels and rejects duplicate tracks', async () => {
    mockIsBodyEmpty.mockReturnValue(false);
    mockParseAndReplace.mockResolvedValue([
      { track: 'Best AI/ML Hack', domain: 'aiml', user_ids: [] },
      { track: 'Most Technically Challenging Hack', domain: 'swe', user_ids: [] },
    ] as any);

    const find = jest.fn().mockReturnValue({ toArray: jest.fn().mockResolvedValue([]) });
    const insertMany = jest.fn().mockResolvedValue({ insertedIds: { 0: 'id-1', 1: 'id-2' } });
    mockGetDatabase.mockResolvedValue({
      collection: jest.fn().mockReturnValue({
        find,
        insertMany,
      }),
    } as any);

    const result = await CreateManyPanels({ some: 'body' });

    expect(result.ok).toBe(true);
    expect(insertMany).toHaveBeenCalledWith([
      { track: 'Best AI/ML Hack', domain: 'aiml', user_ids: [] },
      { track: 'Most Technically Challenging Hack', domain: 'swe', user_ids: [] },
    ]);
  });

  it('rejects duplicate panel tracks in a batch', async () => {
    mockIsBodyEmpty.mockReturnValue(false);
    mockParseAndReplace.mockResolvedValue([
      { track: 'Best AI/ML Hack', domain: 'aiml', user_ids: [] },
      { track: 'Best AI/ML Hack', domain: 'aiml', user_ids: [] },
    ] as any);

    const result = await CreateManyPanels({ some: 'body' });

    expect(result.ok).toBe(false);
    expect(result.error).toContain('Request contains duplicate track(s)');
  });
});