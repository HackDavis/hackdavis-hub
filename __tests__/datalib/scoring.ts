// import { db } from '../../jest.setup';
import Team from '@typeDefs/team';
import type { RankTeamsResults } from '@utils/scoring/rankTeams';
import Submission from '@typeDefs/submission';
import rankTeams from '@utils/scoring/rankTeams';
// import { ObjectId } from 'mongodb';

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
    tracks: [
      'Best AI/ML Hack',
      'Best UI/UX Design',
      'Best User Research',
      'Best Statistical Model',
    ],
    active: true,
  };
  mockTeam2 = {
    _id: 'team2',
    teamNumber: 2,
    tableNumber: 2,
    name: 'Team Two',
    tracks: ['Best AI/ML Hack', 'Best UI/UX Design', 'Best User Research'],
    active: true,
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
          trackName: 'Best AI/ML Hack',
          rawScores: {
            'Innovative Use of AI/ML Techniques': 20,
            'Model Performance and Accuracy': 25,
            'Real-World Impact and Applicability': 15,
          },
          finalTrackScore: null,
        },
        {
          trackName: 'Best UI/UX Design',
          rawScores: {
            'Aesthetic Appeal and Visual Consistency': 18,
            'Intuitive User Flow and Ease of Navigation': 22,
            'Inclusivity, Responsiveness and Accessibility': 16,
          },
          finalTrackScore: null,
        },
      ],
      comments: 'Great implementation',
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
          trackName: 'Best User Research',
          rawScores: {
            'Depth and quality of user research conducted': 24,
            'Incorporation of User Feedback': 18,
            'Originality and Creativity in Meeting User Needs': 20,
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
          trackName: 'Best AI/ML Hack',
          rawScores: {
            'Innovative Use of AI/ML Techniques': 23,
            'Model Performance and Accuracy': 19,
            'Real-World Impact and Applicability': 17,
          },
          finalTrackScore: null,
        },
        {
          trackName: 'Best UI/UX Design',
          rawScores: {
            'Aesthetic Appeal and Visual Consistency': 25,
            'Intuitive User Flow and Ease of Navigation': 24,
            'Inclusivity, Responsiveness and Accessibility': 21,
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
          trackName: 'Best User Research',
          rawScores: {
            'Depth and quality of user research conducted': 26,
            'Incorporation of User Feedback': 21,
            'Originality and Creativity in Meeting User Needs': 23,
          },
          finalTrackScore: null,
        },
      ],
      comments: 'Innovative solution with real-world application',
      is_scored: true,
      queuePosition: null,
    },
  ];

  // Calculate the expected scores according to the new algorithm
  // For submission1 (team1, Best AI/ML Hack):
  // Static: (8 + 9 + 7) * 0.4 = 9.6
  // Dynamic: (20 + 25 + 15) * 0.6 = 36
  // Total: 45.6

  // For submission3 (team2, Best AI/ML Hack):
  // Static: (9 + 8 + 9) * 0.4 = 10.4
  // Dynamic: (23 + 19 + 17) * 0.6 = 35.4
  // Total: 45.8

  // For submission1 (team1, Best UI/UX Design):
  // Static: (8 + 9 + 7) * 0.4 = 9.6
  // Dynamic: (18 + 22 + 16) * 0.6 = 33.6
  // Total: 43.2

  // For submission3 (team2, Best UI/UX Design):
  // Static: (9 + 8 + 9) * 0.4 = 10.4
  // Dynamic: (25 + 24 + 21) * 0.6 = 42
  // Total: 52.4

  // For submission2 (team1, Best User Research):
  // Static: (7 + 8 + 9) * 0.4 = 9.6
  // Dynamic: (24 + 18 + 20) * 0.6 = 37.2
  // Total: 46.8

  // For submission4 (team2, Best User Research):
  // Static: (10 + 9 + 8) * 0.4 = 10.8
  // Dynamic: (26 + 21 + 23) * 0.6 = 42
  // Total: 52.8

  mockExpectedResults = {
    'Best AI/ML Hack': [
      {
        team: {
          team_id: 'team2',
          final_score: 45.8, // (9+8+9)*0.4 + (23+19+17)*0.6
          comments: ['Outstanding technical work'],
        },
      },
      {
        team: {
          team_id: 'team1',
          final_score: 45.6, // (8+9+7)*0.4 + (20+25+15)*0.6
          comments: ['Great implementation'],
        },
      },
    ],
    'Best UI/UX Design': [
      {
        team: {
          team_id: 'team2',
          final_score: 52.4, // (9+8+9)*0.4 + (25+24+21)*0.6
          comments: ['Outstanding technical work'],
        },
      },
      {
        team: {
          team_id: 'team1',
          final_score: 43.2, // (8+9+7)*0.4 + (18+22+16)*0.6
          comments: ['Great implementation'],
        },
      },
    ],
    'Best User Research': [
      {
        team: {
          team_id: 'team2',
          final_score: 52.8, // (10+9+8)*0.4 + (26+21+23)*0.6
          comments: ['Innovative solution with real-world application'],
        },
      },
      {
        team: {
          team_id: 'team1',
          final_score: 46.8, // (7+8+9)*0.4 + (24+18+20)*0.6
          comments: ['Strong social impact'],
        },
      },
    ],
  };
});

describe('Team Scoring Algorithm with 2 Teams, 2 Judges, and 4 Submissions', () => {
  test('rankTeams should calculate scores correctly and rank teams', () => {
    // Call the ranking algorithm directly with our controlled input
    const results = rankTeams({
      teams: [mockTeam1, mockTeam2],
      submissions: mockSubmissions,
    });

    // Verify the structure of the results
    expect(Object.keys(results)).toEqual(
      expect.arrayContaining([
        'Best AI/ML Hack',
        'Best UI/UX Design',
        'Best User Research',
      ])
    );

    // Check if each track has the correct teams ranked
    for (const trackName in mockExpectedResults) {
      // First check if the track exists in results
      expect(results).toHaveProperty(trackName);

      // Now that we know it exists, we can safely compare lengths
      expect(results[trackName].length).toBe(
        mockExpectedResults[trackName].length
      );

      // For each track, verify the team scores and order
      for (let i = 0; i < results[trackName].length; i++) {
        const resultTeam = results[trackName][i].team;
        const expectedTeam = mockExpectedResults[trackName][i].team;

        expect(resultTeam.team_id).toBe(expectedTeam.team_id);
        expect(resultTeam.final_score).toBeCloseTo(expectedTeam.final_score, 1); // Using toBeCloseTo to handle floating point precision
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

export { mockSubmissions, mockTeam1, mockTeam2 };
