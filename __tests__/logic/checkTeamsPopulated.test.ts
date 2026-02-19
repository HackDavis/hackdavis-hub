import { db } from '../../jest.setup';
import checkTeamsPopulated from '@actions/logic/checkTeamsPopulated';
import * as mongoClient from '@utils/mongodb/mongoClient.mjs';

beforeEach(async () => {
  await db.collection('teams').deleteMany({});
});

describe('checkTeamsPopulated', () => {
  it('should return populated false and count 0 when no teams exist', async () => {
    const result = await checkTeamsPopulated();
    expect(result.ok).toBe(true);
    expect(result.populated).toBe(false);
    expect(result.count).toBe(0);
    expect(result.error).toBe(null);
  });

  it('should return populated true and correct count when teams exist', async () => {
    await db.collection('teams').insertMany(
      [
        {
          name: 'Team 1',
          teamNumber: 1,
          tableNumber: 1,
          tracks: ['Best Hardware Hack'],
          active: true,
        },
        {
          name: 'Team 2',
          teamNumber: 2,
          tableNumber: 2,
          tracks: ['Data Science/Machine Learning'],
          active: true,
        },
        {
          name: 'Team 3',
          teamNumber: 3,
          tableNumber: 3,
          tracks: ['Beginner'],
          active: false,
        },
      ],
      { bypassDocumentValidation: true }
    );

    const result = await checkTeamsPopulated();
    expect(result.ok).toBe(true);
    expect(result.populated).toBe(true);
    expect(result.count).toBe(3);
    expect(result.error).toBe(null);
  });

  it('should return populated true and count 1 when exactly one team exists', async () => {
    await db.collection('teams').insertOne(
      {
        name: 'Solo Team',
        teamNumber: 1,
        tableNumber: 1,
        tracks: ['Best Hardware Hack'],
        active: true,
      },
      { bypassDocumentValidation: true }
    );

    const result = await checkTeamsPopulated();
    expect(result.ok).toBe(true);
    expect(result.populated).toBe(true);
    expect(result.count).toBe(1);
    expect(result.error).toBe(null);
  });

  it('should handle database errors gracefully', async () => {
    // Mock the getDatabase to throw an error
    const mockGetDatabase = jest
      .spyOn(mongoClient, 'getDatabase')
      .mockRejectedValue(new Error('Database connection failed'));

    const result = await checkTeamsPopulated();

    expect(result.ok).toBe(false);
    expect(result.populated).toBe(false);
    expect(result.count).toBe(0);
    expect(result.error).toBe('Database connection failed');

    // Restore the mock
    mockGetDatabase.mockRestore();
  });
});
