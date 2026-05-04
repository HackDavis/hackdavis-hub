jest.mock('@data/tracks', () => ({
  __esModule: true,
  judgeVisibleTracks: {
    'Best AI/ML Hack': {
      name: 'Best AI/ML Hack',
      domain: 'aiml',
      domainDisplayName: 'Data Science or AI/ML',
      scoring_criteria: [
        {
          attribute: 'Necessity of AI/ML for Solving the Problem',
          guidelines: { 1: 'low', 3: 'mid', 5: 'high' },
        },
      ],
    },
  },
  bestHackForSocialGood: {
    name: 'Best Hack for Social Good',
  },
}));

import rankTeams from '@utils/scoring/rankTeams';

describe('rankTeams sponsored tracks', () => {
  it('includes sponsored non-HD tracks that are flagged as judge-visible', () => {
    const results = rankTeams({
      submissions: [
        {
          judge_id: 'judge-1',
          team_id: 'team-1',
          social_good: 5,
          creativity: 4,
          presentation: 3,
          scores: [
            {
              trackName: 'Best AI/ML Hack',
              rawScores: {
                'Necessity of AI/ML for Solving the Problem': 5,
              },
              finalTrackScore: 5,
            },
          ],
          comments: 'strong demo',
          is_scored: true,
          queuePosition: null,
        },
      ],
    });

    expect(results['Best AI/ML Hack']).toBeDefined();
    expect(results['Best AI/ML Hack']).toHaveLength(1);
    expect(results['Best AI/ML Hack'][0].team.team_id).toBe('team-1');
  });

  it('still filters out non-judge-visible sponsor tracks', () => {
    const results = rankTeams({
      submissions: [
        {
          judge_id: 'judge-1',
          team_id: 'team-2',
          social_good: 5,
          creativity: 4,
          presentation: 3,
          scores: [
            {
              trackName: 'Best Hack for ASUCD Pantry',
              rawScores: {
                'Track-specific criteria': 5,
              },
              finalTrackScore: 5,
            },
          ],
          comments: 'good work',
          is_scored: true,
          queuePosition: null,
        },
      ],
    });

    expect(results['Best Hack for ASUCD Pantry']).toBeUndefined();
  });
});
