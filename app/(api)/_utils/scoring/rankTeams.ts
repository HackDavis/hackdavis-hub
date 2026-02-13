import Submission from '@typeDefs/submission';
import { optedHDTracks, bestHackForSocialGood } from '@data/tracks';

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

      // Only process the track if it exists in optedHDTracks
      if (!optedHDTracks[trackName]) {
        // For tracks not in optedHDTracks, return null or a score of 0
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
      submission_count: number; // Track number of submissions
    };
  }[];
}

export interface RankTeamsProps {
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

export default function RankTeams({ submissions }: RankTeamsProps) {
  const results: RankTeamsResults = {};

  // Group submissions by team_id
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
  ); // {"team_id": [submission1, submission2, ...]}

  // Process each team's submissions
  for (const team_id in submissionsByTeam) {
    const teamSubmissions = submissionsByTeam[team_id];

    // each team has many submissions from the judges
    for (const submission of teamSubmissions) {
      const final_scores = calculateSubmissionScore(submission);

      // process each track score from this submission
      for (const trackScore of final_scores) {
        const { track_name, score } = trackScore;

        // Skip if the track isn't in optedHDTracks (though this should be filtered already)
        if (!optedHDTracks[track_name]) continue;

        // initialize the track in the results if haven't done yet
        if (!results[track_name]) {
          results[track_name] = [];
        }

        // if the team already exists in the track
        const existingTeamIndex = results[track_name].findIndex(
          (item) => item.team.team_id === team_id
        );

        if (existingTeamIndex !== -1) {
          // - we update the score by adding it up
          const existing_team = results[track_name][existingTeamIndex];
          existing_team.team.final_score += score; // add the score up
          existing_team.team.submission_count += 1; // increment submission count

          // - add the comments as well
          if (submission.comments) {
            existing_team.team.comments.push(submission.comments);
          }
        } else {
          // else we initialize a new team with the current score for that track
          results[track_name].push({
            team: {
              team_id: team_id,
              final_score: score,
              comments: submission.comments
                ? [submission.comments]
                : ([] as string[]),
              submission_count: 1, // initialize submission count
            },
          });
        }
      }
    }
  }

  // Best Hack for Social Good: automatic track (non-optedHDTracks) based on social_good scores
  results[bestHackForSocialGood.name] = [];
  for (const team_id in submissionsByTeam) {
    const teamSubmissions = submissionsByTeam[team_id];
    let totalSocialGood = 0;
    let count = 0;
    const comments: string[] = [];

    teamSubmissions.forEach((submission) => {
      if (submission.social_good !== null) {
        totalSocialGood += submission.social_good;
        count++;
        if (submission.comments) {
          comments.push(submission.comments);
        }
      }
    });

    if (count > 0) {
      results[bestHackForSocialGood.name].push({
        team: {
          team_id,
          final_score: totalSocialGood / count,
          comments,
          submission_count: count,
        },
      });
    }
  }

  // Calculate average scores and sort teams for each track
  for (const track_name in results) {
    // Calculate average scores (skip Best Hack for Social Good since already averaged)
    if (track_name !== bestHackForSocialGood.name) {
      results[track_name].forEach((item) => {
        if (item.team.submission_count > 0) {
          item.team.final_score =
            item.team.final_score / item.team.submission_count;
        }
      });
    }

    // Sort teams by score (from highest to lowest)
    results[track_name].sort((a, b) => b.team.final_score - a.team.final_score);
  }

  return results;
}
