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
  nonHDTracks: {
    'Best AI/ML Hack': {
      name: 'Best AI/ML Hack',
      domain: 'aiml',
    },
    'Best Hack for ASUCD Pantry': {
      name: 'Best Hack for ASUCD Pantry',
    },
  },
  sponsoredNotSendingJudges: {
    'Best AI/ML Hack': {
      name: 'Best AI/ML Hack',
      domain: 'aiml',
    },
  },
}));

jest.mock('@datalib/users/getUser', () => ({
  __esModule: true,
  GetManyUsers: jest.fn(),
}));

jest.mock('@datalib/teams/getTeam', () => ({
  __esModule: true,
  GetManyTeams: jest.fn(),
}));

jest.mock('@datalib/judgeToTeam/getJudgeToTeamPairings', () => ({
  __esModule: true,
  GetJudgeToTeamPairings: jest.fn(),
}));

import matchAllTeams from '@utils/matching/judgesToTeamsAlgorithm';
import { GetManyUsers } from '@datalib/users/getUser';
import { GetManyTeams } from '@datalib/teams/getTeam';
import { GetJudgeToTeamPairings } from '@datalib/judgeToTeam/getJudgeToTeamPairings';

const mockGetManyUsers = GetManyUsers as jest.MockedFunction<typeof GetManyUsers>;
const mockGetManyTeams = GetManyTeams as jest.MockedFunction<typeof GetManyTeams>;
const mockGetJudgeToTeamPairings = GetJudgeToTeamPairings as jest.MockedFunction<
  typeof GetJudgeToTeamPairings
>;

describe('judgesToTeamsAlgorithm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('keeps judge-visible sponsored tracks and removes non-judge sponsor tracks', async () => {
    mockGetManyUsers.mockResolvedValue({
      ok: true,
      body: [
        {
          _id: 'judge-1',
          specialties: ['aiml', 'swe'],
        },
        {
          _id: 'judge-2',
          specialties: ['swe', 'aiml'],
        },
        {
          _id: 'judge-3',
          specialties: ['aiml'],
        },
      ] as any,
      error: null,
    } as any);

    mockGetManyTeams.mockResolvedValue({
      ok: true,
      body: [
        {
          _id: 'team-1',
          tracks: [
            'Best AI/ML Hack',
            'Best Hack for ASUCD Pantry',
            'Most Technically Challenging Hack',
          ],
        },
      ] as any,
      error: null,
    } as any);

    mockGetJudgeToTeamPairings.mockResolvedValue({
      ok: true,
      body: [],
      error: null,
    } as any);

    const result = await matchAllTeams({ alpha: 1 });

    expect(result.matchQualityStats['team-1'].teamDomains).toEqual([
      'aiml',
      'swe',
    ]);
    expect(result.matchQualityStats['team-1'].judgeDomains).toHaveLength(2);
    expect(result.judgeToTeam).toHaveLength(2);
  });
});