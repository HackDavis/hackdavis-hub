import { db } from '../../jest.setup';
import { CreateEvent } from '@datalib/events/createEvent';
import { GetEvent, GetEvents } from '@datalib/events/getEvent';
import { UpdateEvent } from '@datalib/events/updateEvent';
import { DeleteEvent } from '@datalib/events/deleteEvent';
import Event from '@typeDefs/event';
import scoreTeams from '@actions/logic/scoreTeams';
import Team from '@typeDefs/team';
import type { RankTeamsResults } from '@utils/scoring/rankTeams';
import Submission from '@typeDefs/submission';
import { CreateManyTeams } from '@datalib/teams/createTeams';
import { CreateSubmission } from '@datalib/submissions/createSubmission';
import User from '@typeDefs/user';

let mockRankedResult: RankTeamsResults;
let mockTeam: Team;
let mockTeam2: Team;
let mockSubmissions: Submission[];
let mockJudge1: User;
let mockJudge2: User;

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
  mockTeam = {
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
  mockJudge1 = {
    _id: 'judge1',
    name: 'Judge One',
    email: 'judge1@test.com',
    password: 'temp',
    role: 'judge',
    has_checked_in: true,
  };

  mockJudge2 = {
    _id: 'judge2',
    name: 'Judge Two',
    email: 'judge2@test.com',
    password: 'temp',
    role: 'judge',
    has_checked_in: true,
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
});

describe('Scoring Normally', async () => {
  await CreateManyTeams([mockTeam, mockTeam2]);

  for (const mock_submission of mockSubmissions) {
    await CreateSubmission({
      judge_id: mockJudge1,
      team_id: mockTeam,
    });
  }
  it('scoring should be the same as mockRankedResult'),
    () => {
      const ranked_result = scoreTeams();
    };
});

describe('READ: events', () => {
  it('should retrieve no events from an empty database', async () => {
    const { ok, body, error } = await GetEvents({});
    expect(ok).toBe(true);
    expect(body).toBeInstanceOf(Array);
    expect(body.length).toBe(0);
    expect(error).toBe(null);
  });

  it('should retrieve all events', async () => {
    await CreateEvent(mockEvent1);
    await CreateEvent(mockEvent2);

    const { ok, body, error } = await GetEvents({});
    expect(ok).toBe(true);
    expect(body).toBeInstanceOf(Array);
    expect(body.length).toBe(2);
    expect(error).toBe(null);
  });

  it('should retrieve an event by valid event ID', async () => {
    const { body: insertedEvent } = await CreateEvent(mockEvent1);
    if (!insertedEvent._id) fail();

    const { ok, body, error } = await GetEvent(insertedEvent._id.toString());
    expect(ok).toBe(true);
    expect(body).toStrictEqual(insertedEvent);
    expect(error).toBe(null);
  });

  it('should fail to retrieve an event with a non-existent event ID', async () => {
    const { ok, body, error } = await GetEvent('123412341234123412341234');
    expect(ok).toBe(false);
    expect(body).toBe(null);
    expect(error).toBe('Event with id: 123412341234123412341234 not found.');
  });

  it('should fail to retrieve an event with a malformed event ID', async () => {
    const { ok, body, error } = await GetEvent('1234');
    expect(ok).toBe(false);
    expect(body).toBe(null);
    expect(error).toBe('hex string must be 24 characters');
  });
});
export { mockSubmissions, mockRankedResult, mockTeam, mockTeam2 };
