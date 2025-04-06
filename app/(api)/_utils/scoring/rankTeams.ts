import Submission from '@typeDefs/submission';
import Team from '@typeDefs/team';
import { categorizedTracks } from '@data/tracks';

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
  return submission.scores
    .map((track_score) => {
      const trackName = track_score.trackName;

      // Only process the track if it exists in categorizedTracks
      if (!categorizedTracks[trackName]) {
        // For tracks not in categorizedTracks, return null or a score of 0
        // This will allow us to filter them out later
        return {
          track_name: trackName,
          score: 0,
          isValid: false,
        };
      }

      // Calculate static scores (40%)
      const staticScores = [
        submission.social_good || 0,
        submission.creativity || 0,
        submission.presentation || 0,
      ];
      const totalStaticScore = staticScores.reduce(
        (sum, score) => sum + score,
        0
      );

      // Calculate dynamic scores (60%)
      const dynamicScores = Object.values(track_score.rawScores);
      const totalDynamicScore = dynamicScores.reduce(
        (sum, score) => sum + score,
        0
      );

      // Calculate final weighted score
      const weightedStaticScore = 0.4 * totalStaticScore;
      const weightedDynamicScore = 0.6 * totalDynamicScore;
      const finalScore = weightedStaticScore + weightedDynamicScore;

      return {
        track_name: trackName,
        score: finalScore,
        isValid: true,
      };
    })
    .filter((score) => score.isValid); // Filter out invalid/non-categorized tracks
}

export interface RankTeamsResults {
  [track_name: string]: {
    team: {
      team_id: string;
      final_score: number;
      comments: string[];
    };
  }[];
}

export interface RankTeamsProps {
  teams: Team[];
  submissions: Submission[];
}
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

export default function RankTeams({ teams, submissions }: RankTeamsProps) {
  const results: RankTeamsResults = {};

  const group_team = (
    acc: Record<string, Submission[]>,
    submission: Submission
  ) => {
    if (!acc[submission.team_id]) {
      acc[submission.team_id] = [];
    }
    acc[submission.team_id].push(submission);
    return acc;
  };

  const submissionsByTeam = submissions.reduce(
    group_team,
    {} as Record<string, Submission[]>
  ); // {"team_name": [{track_name: scorw}]}

  for (const team of teams) {
    const teamSubmissions = submissionsByTeam[team._id as string] || [];

    // each team has many submissions from the judges
    for (const submission of teamSubmissions) {
      const final_scores = calculateSubmissionScore(submission);

      // process each track score from this submission
      for (const trackScore of final_scores) {
        const { track_name, score } = trackScore;

        // Skip if the track isn't in categorizedTracks (though this should be filtered already)
        if (!categorizedTracks[track_name]) continue;

        // initilize the track in the results if havent done yet
        if (!results[track_name]) {
          results[track_name] = [];
        }

        // if the team already exists in the track
        const existingTeamIndex = results[track_name].findIndex(
          (item) => item.team.team_id === team._id
        );

        if (existingTeamIndex !== -1) {
          // - we update the score by adding it up

          const existing_team = results[track_name][existingTeamIndex];

          existing_team.team.final_score += score; // add the score up

          // - add the commends as well
          if (submission.comments) {
            existing_team.team.comments.push(submission.comments);
          }
        } else {
          // else we initialize a new team with the current score for that track
          results[track_name].push({
            team: {
              team_id: team._id as string,
              final_score: score,
              comments: submission.comments
                ? [submission.comments]
                : ([] as string[]),
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
