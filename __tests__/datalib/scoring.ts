import { db } from '../../jest.setup';
import Team from '@typeDefs/team';
import type { RankTeamsResults } from '@utils/scoring/rankTeams';
import Submission from '@typeDefs/submission';
import rankTeams from '@utils/scoring/rankTeams';
import { ObjectId } from 'mongodb';

let mockRankedResult: RankTeamsResults;
let mockTeam1: Team;
let mockTeam2: Team;
let mockSubmissions: Submission[];
// let mockJudge1: User;
// let mockJudge2: User;
let mockExpectedResults: RankTeamsResults;

/*
testing scoring 
    requirements:
        we need a set of judges? - this might not be needed since the function doesn't require the judges
        we need a set of teams
        we need a set of submissions matching from the judges and the teams
    
    process:
        generate a set of teams in mock db
        generate a set of submissions with tracks in mock db
        run the RankTeams function to compute the scores and return that

*/

beforeEach(() => {
  mockTeam1 = {
    _id: 'team1',
    teamNumber: 1,
    tableNumber: 1,
    name: 'Team One',
    tracks: ['Best Mobile App', 'Best Web App', 'Best Hack for Social Good'],
    active: true,
  };
  mockTeam2 = {
    _id: 'team2',
    teamNumber: 2,
    tableNumber: 2,
    name: 'Team Two',
    tracks: ['Best Mobile App', 'Best Web App', 'Best Hack for Social Good'],
    active: true,
  };

  mockRankedResult = {
    'Best Mobile App': [
      {
        team: {
          team_id: 'team2',
          final_score: 59, // 23 + 19 + 17
          comments: ['Outstanding technical work'],
        },
      },
      {
        team: {
          team_id: 'team1',
          final_score: 60, // 20 + 25 + 15
          comments: ['Great mobile implementation'],
        },
      },
    ],
    'Best Web App': [
      {
        team: {
          team_id: 'team2',
          final_score: 70, // 25 + 24 + 21
          comments: ['Outstanding technical work'],
        },
      },
      {
        team: {
          team_id: 'team1',
          final_score: 56, // 18 + 22 + 16
          comments: ['Great mobile implementation'],
        },
      },
    ],
    'Best Hack for Social Good': [
      {
        team: {
          team_id: 'team2',
          final_score: 70, // 26 + 21 + 23
          comments: ['Innovative solution with real-world application'],
        },
      },
      {
        team: {
          team_id: 'team1',
          final_score: 62, // 24 + 18 + 20
          comments: ['Strong social impact'],
        },
      },
    ],
  };

  mockSubmissions = [
    {
      _id: 'submission1',
      judge_id: 'judge1',
      team_id: 'team1',
      social_good: 8,
      creativity: 9,
      presentation: 7,
      scores: [
        {
          trackName: 'Best Mobile App',
          rawScores: {
            technical: 20,
            design: 25,
            innovation: 15,
          },
          finalTrackScore: null,
        },
        {
          trackName: 'Best Web App',
          rawScores: {
            technical: 18,
            design: 22,
            innovation: 16,
          },
          finalTrackScore: null,
        },
      ],
      comments: 'Great mobile implementation',
      is_scored: true,
      queuePosition: null,
    },
    {
      _id: 'submission2',
      judge_id: 'judge2',
      team_id: 'team1',
      social_good: 7,
      creativity: 8,
      presentation: 9,
      scores: [
        {
          trackName: 'Best Hack for Social Good',
          rawScores: {
            impact: 24,
            feasibility: 18,
            creativity: 20,
          },
          finalTrackScore: null,
        },
      ],
      comments: 'Strong social impact',
      is_scored: true,
      queuePosition: null,
    },
    {
      _id: 'submission3',
      judge_id: 'judge1',
      team_id: 'team2',
      social_good: 9,
      creativity: 8,
      presentation: 9,
      scores: [
        {
          trackName: 'Best Mobile App',
          rawScores: {
            technical: 23,
            design: 19,
            innovation: 17,
          },
          finalTrackScore: null,
        },
        {
          trackName: 'Best Web App',
          rawScores: {
            technical: 25,
            design: 24,
            innovation: 21,
          },
          finalTrackScore: null,
        },
      ],
      comments: 'Outstanding technical work',
      is_scored: true,
      queuePosition: null,
    },
    {
      _id: 'submission4',
      judge_id: 'judge2',
      team_id: 'team2',
      social_good: 10,
      creativity: 9,
      presentation: 8,
      scores: [
        {
          trackName: 'Best Hack for Social Good',
          rawScores: {
            impact: 26,
            feasibility: 21,
            creativity: 23,
          },
          finalTrackScore: null,
        },
      ],
      comments: 'Innovative solution with real-world application',
      is_scored: true,
      queuePosition: null,
    },
  ];

  mockExpectedResults = {
    'Best Mobile App': [
      {
        team: {
          team_id: 'team1',
          final_score: 60, // 20 + 25 + 15
          comments: ['Great mobile implementation'],
        },
      },
      {
        team: {
          team_id: 'team2',
          final_score: 59, // 23 + 19 + 17
          comments: ['Outstanding technical work'],
        },
      },
    ],
    'Best Web App': [
      {
        team: {
          team_id: 'team2',
          final_score: 70, // 25 + 24 + 21
          comments: ['Outstanding technical work'],
        },
      },
      {
        team: {
          team_id: 'team1',
          final_score: 56, // 18 + 22 + 16
          comments: ['Great mobile implementation'],
        },
      },
    ],
    'Best Hack for Social Good': [
      {
        team: {
          team_id: 'team2',
          final_score: 70, // 26 + 21 + 23
          comments: ['Innovative solution with real-world application'],
        },
      },
      {
        team: {
          team_id: 'team1',
          final_score: 62, // 24 + 18 + 20
          comments: ['Strong social impact'],
        },
      },
    ],
  };
});

describe('Team Scoring Algorithm', () => {
  test('rankTeams should calculate scores correctly and rank teams', () => {
    // Call the ranking algorithm directly with our controlled input
    const results = rankTeams({
      teams: [mockTeam1, mockTeam2],
      submissions: mockSubmissions,
    });

    // Verify the structure of the results
    expect(Object.keys(results)).toEqual(
      expect.arrayContaining([
        'Best Mobile App',
        'Best Web App',
        'Best Hack for Social Good',
      ])
    );

    // Check if each track has the correct teams ranked
    for (const trackName in results) {
      expect(results[trackName].length).toBe(
        mockExpectedResults[trackName].length
      );

      // For each track, verify the team scores and order
      for (let i = 0; i < results[trackName].length; i++) {
        const resultTeam = results[trackName][i].team;
        const expectedTeam = mockExpectedResults[trackName][i].team;

        expect(resultTeam.team_id).toBe(expectedTeam.team_id);
        expect(resultTeam.final_score).toBe(expectedTeam.final_score);
        expect(resultTeam.comments).toEqual(
          expect.arrayContaining(expectedTeam.comments)
        );
      }
    }
  });

  test('rankTeams should handle missing submissions for teams', () => {
    // Create a new team with no submissions
    const mockTeam3: Team = {
      _id: 'team3',
      teamNumber: 3,
      tableNumber: 3,
      name: 'Team Three',
      tracks: ['Best Mobile App', 'Best Web App'],
      active: true,
    };

    // Call the ranking algorithm
    const results = rankTeams({
      teams: [mockTeam1, mockTeam2, mockTeam3],
      submissions: mockSubmissions,
    });

    // Team3 should not appear in results since it has no submissions
    for (const trackName in results) {
      const teamIds = results[trackName].map((item) => item.team.team_id);
      expect(teamIds).not.toContain('team3');
    }
  });

  test('rankTeams should handle empty submissions array', () => {
    // Call the ranking algorithm with empty submissions
    const results = rankTeams({
      teams: [mockTeam1, mockTeam2],
      submissions: [],
    });

    // Results should have track keys but empty arrays
    expect(Object.keys(results).length).toBe(0);
  });
});
describe('Scoring Algo with DB integrations', () => {
  // Optional: Test with database integration if needed
  test('rankTeams shouldwork with submissions from database', async () => {
    // Skip this test if DB is not set up in test environment
    if (!db) {
      console.log('Skipping DB test - no database connection');
      return;
    }

    // Create new ObjectIds for test data
    const team1Id = new ObjectId();
    const team2Id = new ObjectId();

    // Insert teams and submissions into the test database
    await db.collection('teams').insertMany([
      { ...mockTeam1, _id: team1Id },
      { ...mockTeam2, _id: team2Id },
    ]);

    // Create new ObjectIds for each submission
    const submissionsWithIds = mockSubmissions.map((sub) => ({
      ...sub,
      _id: new ObjectId(),
    }));

    await db.collection('submissions').insertMany(submissionsWithIds);

    // Fetch from DB
    const teams = await db.collection('teams').find({}).toArray();
    const submissions = await db.collection('submissions').find({}).toArray();

    // Call ranking algorithm with DB data
    const results = rankTeams({
      teams: teams as unknown as Team[],
      submissions: submissions as unknown as Submission[],
    });

    // Verify results (similar assertions as the first test)
    expect(Object.keys(results)).toEqual(
      expect.arrayContaining([
        'Best Mobile App',
        'Best Web App',
        'Best Hack for Social Good',
      ])
    );
  });
});

export { mockSubmissions, mockRankedResult, mockTeam1, mockTeam2 };
