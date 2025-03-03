import { getDatabase } from '../mongodb/mongoClient.mjs';
import Team from '../../../_types/team';
import Submission from '../../../_types/submission';
import * as fs from 'fs';
import * as path from 'path';

// Function to calculate the average score for a team based on all submissions
function calculateTeamAverageScore(
  team: Team,
  submissions: Submission[]
): number {
  if (submissions.length === 0) return 0;

  let totalScore = 0;
  let submissionCount = 0;

  for (const submission of submissions) {
    if (submission.is_scored) {
      // Calculate the average of the three main criteria
      const criteriaAvg =
        (submission.social_good +
          submission.creativity +
          submission.presentation) /
        3;

      // Calculate track scores if available
      let trackScoreSum = 0;
      let trackCount = 0;

      if (submission.scores && submission.scores.length > 0) {
        for (const trackScore of submission.scores) {
          if (trackScore.finalTrackScore !== null) {
            trackScoreSum += trackScore.finalTrackScore;
            trackCount++;
          }
        }
      }

      // Combine criteria average with track scores if available
      let submissionScore = criteriaAvg;
      if (trackCount > 0) {
        const trackAvg = trackScoreSum / trackCount;
        submissionScore = (submissionScore + trackAvg) / 2;
      }

      totalScore += submissionScore;
      submissionCount++;
    }
  }

  return submissionCount > 0 ? totalScore / submissionCount : 0;
}

// Main function to shortlist teams
async function shortlistTopTeams(limit: number = 5) {
  try {
    console.log(`Starting to shortlist top ${limit} teams...`);

    // Connect to the database
    const db = await getDatabase();

    // Get all active teams
    const teams = (await db
      .collection('teams')
      .find({ active: true })
      .toArray()) as Team[];

    console.log(`Found ${teams.length} active teams.`);

    // Get all submissions
    const submissions = (await db
      .collection('submissions')
      .find({ is_scored: true })
      .toArray()) as Submission[];

    console.log(`Found ${submissions.length} scored submissions.`);

    // Group submissions by team_id
    const submissionsByTeam = new Map<string, Submission[]>();

    for (const submission of submissions) {
      const teamId = submission.team_id.toString();
      if (!submissionsByTeam.has(teamId)) {
        submissionsByTeam.set(teamId, []);
      }
      submissionsByTeam.get(teamId)?.push(submission);
    }

    // Calculate average score for each team
    const teamScores = teams.map((team) => {
      const teamId = team._id?.toString() || '';
      const teamSubmissions = submissionsByTeam.get(teamId) || [];
      const averageScore = calculateTeamAverageScore(team, teamSubmissions);

      return {
        teamId,
        teamNumber: team.teamNumber,
        tableNumber: team.tableNumber,
        name: team.name,
        tracks: team.tracks,
        averageScore,
        submissionCount: teamSubmissions.length,
      };
    });

    // Sort teams by average score (descending)
    teamScores.sort((a, b) => b.averageScore - a.averageScore);

    // Get top teams
    const topTeams = teamScores.slice(0, limit);

    console.log('\n===== TOP TEAMS =====');
    topTeams.forEach((team, index) => {
      console.log(
        `${index + 1}. ${team.name} (Table ${
          team.tableNumber
        }) - Score: ${team.averageScore.toFixed(2)}`
      );
      console.log(`   Tracks: ${team.tracks.join(', ')}`);
      console.log(`   Submissions: ${team.submissionCount}`);
      console.log('-------------------');
    });

    // Save results to a JSON file
    const resultsDir = path.join(process.cwd(), 'results');
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const filePath = path.join(resultsDir, `top_teams_${timestamp}.json`);

    fs.writeFileSync(
      filePath,
      JSON.stringify(
        {
          timestamp: new Date().toISOString(),
          topTeams,
          allTeams: teamScores,
        },
        null,
        2
      )
    );

    console.log(`\nResults saved to ${filePath}`);

    return topTeams;
  } catch (error) {
    console.error('Error shortlisting teams:', error);
    throw error;
  }
}

// Execute the script if run directly
if (require.main === module) {
  // Get the limit from command line arguments or default to 5
  const args = process.argv.slice(2);
  const limit = args.length > 0 ? parseInt(args[0], 10) : 5;

  shortlistTopTeams(limit)
    .then(() => {
      console.log('Shortlisting completed successfully.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Shortlisting failed:', error);
      process.exit(1);
    });
}

// Export for use in other scripts
export { shortlistTopTeams };
