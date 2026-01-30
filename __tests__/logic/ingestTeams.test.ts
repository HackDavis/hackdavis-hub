import { db } from '../../jest.setup';
import ingestTeams from '@actions/logic/ingestTeams';
import ParsedRecord from '@typeDefs/parsedRecord';
import { CreateManyTeams } from '@datalib/teams/createTeams';

// Mock the CreateManyTeams function
jest.mock('@datalib/teams/createTeams', () => ({
  CreateManyTeams: jest.fn(),
}));

const mockCreateManyTeams = CreateManyTeams as jest.MockedFunction<
  typeof CreateManyTeams
>;

beforeEach(async () => {
  await db.collection('teams').deleteMany({});
  jest.clearAllMocks();
});

describe('ingestTeams', () => {
  it('should delegate to CreateManyTeams with the provided body', async () => {
    const mockTeams: ParsedRecord[] = [
      {
        name: 'Team 1',
        teamNumber: 1,
        tableNumber: 1,
        tracks: ['Track A'],
        active: true,
      },
      {
        name: 'Team 2',
        teamNumber: 2,
        tableNumber: 2,
        tracks: ['Track B'],
        active: true,
      },
    ];

    const mockResponse = {
      ok: true,
      body: mockTeams,
      error: null,
      status: 201,
    };

    mockCreateManyTeams.mockResolvedValue(mockResponse);

    const result = await ingestTeams(mockTeams);

    expect(mockCreateManyTeams).toHaveBeenCalledTimes(1);
    expect(mockCreateManyTeams).toHaveBeenCalledWith(mockTeams);
    expect(result).toEqual(mockResponse);
  });

  it('should handle empty body by delegating to CreateManyTeams', async () => {
    const emptyBody = [];
    const mockResponse = {
      ok: false,
      body: null,
      error: 'No Content Provided',
    };

    mockCreateManyTeams.mockResolvedValue(mockResponse);

    const result = await ingestTeams(emptyBody);

    expect(mockCreateManyTeams).toHaveBeenCalledTimes(1);
    expect(mockCreateManyTeams).toHaveBeenCalledWith(emptyBody);
    expect(result).toEqual(mockResponse);
  });

  it('should handle CreateManyTeams errors gracefully', async () => {
    const mockTeams: ParsedRecord[] = [
      {
        name: 'Invalid Team',
        teamNumber: 999,
        tableNumber: 999,
        tracks: ['Invalid Track'],
        active: true,
      },
    ];

    const mockResponse = {
      ok: false,
      body: null,
      error: 'Invalid track',
    };

    mockCreateManyTeams.mockResolvedValue(mockResponse);

    const result = await ingestTeams(mockTeams);

    expect(mockCreateManyTeams).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResponse);
  });

  it('should handle duplicate team numbers by delegating to CreateManyTeams', async () => {
    const mockTeams: ParsedRecord[] = [
      {
        name: 'Team 1',
        teamNumber: 1,
        tableNumber: 1,
        tracks: ['Track A'],
        active: true,
      },
      {
        name: 'Team 1 Duplicate',
        teamNumber: 1,
        tableNumber: 2,
        tracks: ['Track B'],
        active: true,
      },
    ];

    const mockResponse = {
      ok: false,
      body: null,
      error: 'Request contains duplicate team number(s)',
    };

    mockCreateManyTeams.mockResolvedValue(mockResponse);

    const result = await ingestTeams(mockTeams);

    expect(mockCreateManyTeams).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResponse);
  });

  it('should handle single team ingestion', async () => {
    const mockTeam: ParsedRecord[] = [
      {
        name: 'Solo Team',
        teamNumber: 1,
        tableNumber: 1,
        tracks: ['Track A', 'Track B'],
        active: true,
      },
    ];

    const mockResponse = {
      ok: true,
      body: mockTeam,
      error: null,
      status: 201,
    };

    mockCreateManyTeams.mockResolvedValue(mockResponse);

    const result = await ingestTeams(mockTeam);

    expect(mockCreateManyTeams).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResponse);
  });

  it('should preserve all team properties when delegating', async () => {
    const mockTeamsWithAllProps: ParsedRecord[] = [
      {
        name: 'Complete Team',
        teamNumber: 42,
        tableNumber: 10,
        tracks: ['Track A', 'Track B', 'Track C'],
        active: false,
      },
    ];

    const mockResponse = {
      ok: true,
      body: mockTeamsWithAllProps,
      error: null,
      status: 201,
    };

    mockCreateManyTeams.mockResolvedValue(mockResponse);

    const result = await ingestTeams(mockTeamsWithAllProps);

    expect(mockCreateManyTeams).toHaveBeenCalledWith(mockTeamsWithAllProps);
    expect(result).toEqual(mockResponse);
  });
});
