import Submission from '@typeDefs/submission';
import { getManySubmissions } from '@actions/submissions/getSubmission';
import { getManyTeams } from '@actions/teams/getTeams';

// interface Team {
//   _id?: string;
//   teamNumber: number;
//   tableNumber: number;
//   name: string;
//   tracks: string[];
//   active: boolean;
// }

// export interface TrackScore {
//   trackName: string;
//   rawScores: {[question: string] : number};
//   finalTrackScore: number | null;
// }

// export default interface Submission {
//   _id?: string;
//   judge_id: string;
//   team_id: string;
//   social_good: number;
//   creativity: number;
//   presentation: number;
//   scores: TrackScore[];
//   comments?: string;
//   is_scored: boolean;
//   queuePosition: number | null;
// }

function calculateSubmissionScore(submission: Submission) {
  return submission.scores.map((track_score) => {
    const total = Object.values(track_score.rawScores).reduce(
      (sum, score) => sum + score,
      0
    );

    return {
      track_name: track_score.trackName,
      score: total,
    };
  });
}

interface RankTeamsResults {
  [track_name: string]: {
    team: {
      team_id: string;
      final_score: number;
      comments: string[];
    };
  }[];
}

export default async function RankTeams() {
  const results: RankTeamsResults = {};

  // multiple teams
  const team_response = await getManyTeams();

  if (!team_response.ok) {
    return 'Error getting teams';
  }
  const teams = team_response.body;

  for (const team of teams) {
    // each team has many submissions from the judges
    const submission_response = await getManySubmissions(team);

    if (!submission_response.ok) {
      return 'Error getting submissions';
    }

    const submissions = submission_response.body;

    for (const submission of submissions) {
      // each submission has multiple tracks
      // [{track_name : score}, {track_name : score}] format
      const final_scores = calculateSubmissionScore(submission);

      // process each track score from this submission
      for (const trackScore of final_scores) {
        const { track_name, score } = trackScore;

        // initilize the track in the results if havent done yet
        if (!results[track_name]) {
          results[track_name] = [];
        }

        // if the team already exists in the track
        const existingTeamIndex = results[track_name].findIndex(
          (item) => item.team.team_id === team._id
        );

        if (existingTeamIndex) {
          // - we update the score by adding it up

          const existing_team = results[track_name][existingTeamIndex];

          existing_team.team.final_score += score; // add the score up

          // - add the commends as well
          if (submission.comments) {
            existing_team.team.comments.push(submission.commments);
          }
        } else {
          // else we initialize a new team with the current score for that track
          results[track_name].push({
            team: {
              team_id: team._id,
              final_score: score,
              comments: submission.comments ? submission.comments : [],
            },
          });
        }
      }
    }

    for (const track_name in results) {
      // {track_name : team[]}

      // sort each tracks with the result of team.final_score from highest to lowest
      results[track_name].sort(
        (a, b) => b.team.final_score - a.team.final_score
      );
    }
  }

  return results;
}
