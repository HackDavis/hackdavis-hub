import Team from '@typeDefs/team';
import Submission from '@typeDefs/submission';
import { getManySubmissions } from '@actions/submissions/getSubmission';
import data from '@data/db_validation_data.json' assert { type: 'json' };

const tracks = data.tracks;
// TODO: Rework calculateTrackScore
// function calculateTrackScore(chosenTracks: string[], scores: Scores) {
//   const finalScores = chosenTracks.map((chosenTrack) => {
//     const weights = tracks.find((track) => track.name == chosenTrack)?.weights;
//     if (weights === undefined) return 0;
//     const score = weights.reduce((sum, weight, i) => {
//       return sum + weight * scores[i];
//     }, 0);

//     if (score === undefined) {
//       return 0;
//     }

//     return score! / 5;
//   });

//   return finalScores;
// }

function calculateScores(team: Team, submissions: Submission[]) {
  const results: number[] = [0, 0, 0, 0, 0];

  let submissionsCount = 0;
  for (const submission of submissions) {
    if (submission.scores) {
      submissionsCount++;
      // const scores = calculateTrackScore(team.tracks, submission.scores);

      // results = results.map((res, i) => res + scores[i]);
    }
  }

  const finalScores = results.map((res, i) => ({
    track: team.tracks[i],
    score: isNaN(res / submissionsCount) ? 0 : res / submissionsCount,
  }));

  return {
    number: team.tableNumber,
    name: team.name,
    scores: finalScores,
    comments: submissions.map((submission) => submission.comments),
  };
}

async function computeAllTeams(teams: Team[]) {
  const teamScores = [];

  for (const team of teams) {
    const submissions = (
      await getManySubmissions({
        team_id: {
          '*convertId': {
            id: team._id,
          },
        },
      })
    ).body;

    teamScores.push(calculateScores(team, submissions));
  }

  return teamScores;
}

export default async function rankTeams(teams: Team[]) {
  const teamScores = await computeAllTeams(teams);

  const trackResults = [];

  for (const track of tracks) {
    if (track === 'No Track') continue;

    const topEntries = [];

    for (const team of teamScores) {
      const foundScore = team.scores.find((score) => score.track === track);
      if (foundScore === undefined) continue;

      topEntries.push({
        number: team.number,
        name: team.name,
        score: foundScore.score,
        comments: team.comments,
      });
    }

    topEntries.sort((entry1, entry2) => entry2.score - entry1.score);
    if (
      track !== ('Best Hack for Life of Kai' as string) ||
      track !== ('Best Hack for DCMH' as string) ||
      track !== ('Best Hack for AggieHouse' as string)
    ) {
      topEntries.splice(10);
    }

    trackResults.push({
      track: track,
      topEntries,
    });
  }

  return trackResults;
}
