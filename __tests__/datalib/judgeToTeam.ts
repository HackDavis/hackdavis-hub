import { db } from '../../jest.setup';
import { GetJudgeToTeamPairings } from '@datalib/judgeToTeam/getJudgeToTeamPairings';
import { ObjectId } from 'mongodb';
import JudgeToTeam from '@typeDefs/judgeToTeam';

beforeEach(async () => {
  await db.collection('submissions').deleteMany({});
});

// Helper to create valid submission documents
function createSubmission(judgeId: ObjectId, teamId: ObjectId) {
  return {
    judge_id: judgeId,
    team_id: teamId,
    social_good: null,
    creativity: null,
    presentation: null,
    scores: [],
    is_scored: false,
    queuePosition: null,
  };
}

describe('GetJudgeToTeamPairings', () => {
  it('should return an empty array when no submissions exist', async () => {
    const result = await GetJudgeToTeamPairings();
    expect(result.ok).toBe(true);
    expect(result.body).toEqual([]);
    expect(result.error).toBe(null);
  });

  it('should return pairings with string IDs converted from ObjectIds', async () => {
    const judgeId = new ObjectId();
    const teamId = new ObjectId();

    await db
      .collection('submissions')
      .insertOne(createSubmission(judgeId, teamId));

    const result = await GetJudgeToTeamPairings();
    expect(result.ok).toBe(true);
    expect(result.body).toHaveLength(1);
    expect(result.error).toBe(null);

    const pairing = result.body?.[0];
    expect(pairing).toEqual({
      judge_id: judgeId.toString(),
      team_id: teamId.toString(),
    });
  });

  it('should return multiple pairings correctly', async () => {
    const judgeId1 = new ObjectId();
    const judgeId2 = new ObjectId();
    const teamId1 = new ObjectId();
    const teamId2 = new ObjectId();
    const teamId3 = new ObjectId();

    await db
      .collection('submissions')
      .insertMany([
        createSubmission(judgeId1, teamId1),
        createSubmission(judgeId1, teamId2),
        createSubmission(judgeId2, teamId3),
      ]);

    const result = await GetJudgeToTeamPairings();
    expect(result.ok).toBe(true);
    expect(result.body).toHaveLength(3);
    expect(result.error).toBe(null);

    const pairings = result.body as JudgeToTeam[];
    expect(pairings[0]).toEqual({
      judge_id: judgeId1.toString(),
      team_id: teamId1.toString(),
    });
    expect(pairings[1]).toEqual({
      judge_id: judgeId1.toString(),
      team_id: teamId2.toString(),
    });
    expect(pairings[2]).toEqual({
      judge_id: judgeId2.toString(),
      team_id: teamId3.toString(),
    });
  });

  it('should handle duplicate judge-team pairings', async () => {
    const judgeId = new ObjectId();
    const teamId = new ObjectId();

    await db
      .collection('submissions')
      .insertMany([
        createSubmission(judgeId, teamId),
        createSubmission(judgeId, teamId),
      ]);

    const result = await GetJudgeToTeamPairings();
    expect(result.ok).toBe(true);
    expect(result.body).toHaveLength(2);

    const pairings = result.body as JudgeToTeam[];
    expect(pairings[0]).toEqual(pairings[1]);
  });

  it('should convert ObjectIds to strings for duplicate prevention comparison', async () => {
    const judgeId = new ObjectId();
    const teamId = new ObjectId();
    const judgeIdString = judgeId.toString();
    const teamIdString = teamId.toString();

    await db
      .collection('submissions')
      .insertOne(createSubmission(judgeId, teamId));

    const result = await GetJudgeToTeamPairings();
    const pairings = result.body as JudgeToTeam[];

    // This test verifies that String() conversion is necessary for comparison
    // in algorithms like judgesToTeamsAlgorithm.ts
    expect(String(pairings[0].judge_id)).toBe(judgeIdString);
    expect(String(pairings[0].team_id)).toBe(teamIdString);

    // Simulate the duplicate check from judgesToTeamsAlgorithm.ts (lines 183-189)
    const duplicateExists = pairings.some(
      (entry) =>
        String(entry.judge_id) === judgeIdString &&
        String(entry.team_id) === teamIdString
    );
    expect(duplicateExists).toBe(true);
  });
});
