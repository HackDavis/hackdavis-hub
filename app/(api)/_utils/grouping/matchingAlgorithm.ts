import fs from 'fs/promises';
import User from '@typeDefs/user';
import Submission from '@typeDefs/submission';
import Team from '@typeDefs/team';

// Extend the Team interface for this file only.
interface ExtendedTeam extends Team {
  sortedTrackDomains: string[];
}

// Assume these server actions are available for fetching data.
import { getManyUsers } from '@actions/users/getUser';
import { getManyTeams } from '@actions/teams/getTeams';

interface Judge {
  user: User;
  domainMatchScores: { [domain: string]: number }; // Ranked domains: higher score means better expertise.
  teamsAssigned: number;
  priority: number;
}

// Constant alpha to penalize judges for more assignments.
const ALPHA = 0.1;

/**
 * Generate submissions by matching judges to teams.
 */
export async function generateSubmissions(): Promise<Submission[]> {
  // Fetch all judges who are checked in.
  const judgesResponse = await getManyUsers({
    role: 'Judge',
    has_checked_in: true,
  });
  if (!judgesResponse.ok) {
    throw new Error(`Failed to fetch judges: ${judgesResponse.error}`);
  }
  const users: User[] = judgesResponse.body;

  // Convert fetched users into Judge objects.
  const judgesQueue: Judge[] = users.map((user) => ({
    user,
    domainMatchScores: user.specialties
      ? user.specialties.reduce(
          (acc, domain, index) => {
            // Example: assign a decreasing score for each ranked domain.
            acc[domain] = 10 - index;
            return acc;
          },
          {} as { [domain: string]: number }
        )
      : {},
    teamsAssigned: 0,
    priority: 0, // Initialize priority to 0 (will be updated per team).
  }));

  // Fetch teams.
  const teamsResponse = await getManyTeams();
  if (!teamsResponse.ok) {
    throw new Error(`Failed to fetch teams: ${teamsResponse.error}`);
  }
  // Cast the fetched teams to ExtendedTeam to include sortedTrackDomains.
  const modifiedTeams = teamsResponse.body as ExtendedTeam[];

  // Helper function: Get specialty match score for a given team and judge for the specified track index.
  function getSpecialtyMatchScore(
    team: ExtendedTeam,
    judge: Judge,
    trackIndex: number
  ): number {
    const domain = team.sortedTrackDomains
      ? team.sortedTrackDomains[trackIndex]
      : '';
    // Return the judge's match score for that domain, or 0 if not found.
    return domain ? judge.domainMatchScores[domain] ?? 0 : 0;
  }

  // Update the entire judges array (the "queue") based on the current team and track index.
  function updateQueue(
    team: ExtendedTeam,
    trackIndex: number,
    judges: Judge[]
  ): void {
    for (const judge of judges) {
      const specialtyScore = getSpecialtyMatchScore(team, judge, trackIndex);
      // Higher specialty score should lower the "priority" value.
      judge.priority = specialtyScore - ALPHA * judge.teamsAssigned;
    }
    // Sort the judges in ascending order (lowest priority value first).
    judges.sort((a, b) => a.priority - b.priority);
  }

  // Array to hold submissions.
  const submissions: Submission[] = [];
  const rounds = 3;

  // For each team, perform assignment rounds.
  for (const team of modifiedTeams) {
    // Ensure the team has enough sortedTrackDomains.
    if (!team.sortedTrackDomains || team.sortedTrackDomains.length < rounds) {
      console.warn(
        `Team ${team._id} does not have enough sorted track domains.`
      );
      continue;
    }

    for (let i = 0; i < rounds; i++) {
      // Update the judges array based on the current team's i-th domain.
      updateQueue(team, i, judgesQueue);

      // The judge at index 0 is the best match.
      const selectedJudge = judgesQueue[0];
      if (!selectedJudge) {
        console.log(`No available judge for team ${team._id} on round ${i}`);
        break;
      }

      // Create a submission using the selected judge.
      const submission: Submission = {
        judge_id: selectedJudge.user._id as string,
        team_id: team._id as string,
        social_good: 0,
        creativity: 0,
        presentation: 0,
        scores: team.sortedTrackDomains.map((trackName) => ({
          trackName,
          rawScores: [0, 0, 0, 0, 0], // Example: initialize raw scores array.
          finalTrackScore: null,
        })),
        comments: '',
        is_scored: false,
        queuePosition: 0, // Optionally record the judge's position.
      };

      submissions.push(submission);

      // Increase the number of teams assigned for this judge.
      selectedJudge.teamsAssigned += 1;
    }
  }

  console.log('Final submissions:', submissions);
  return submissions;
}

/**
 * Convert an array of submissions to a CSV string.
 */
function convertSubmissionsToCSV(submissions: Submission[]): string {
  // Define CSV header columns.
  const headers = [
    'judge_id',
    'team_id',
    'social_good',
    'creativity',
    'presentation',
    'scores',
    'comments',
    'is_scored',
    'queuePosition',
  ];
  const rows = submissions.map((sub) => {
    return [
      sub.judge_id,
      sub.team_id,
      sub.social_good,
      sub.creativity,
      sub.presentation,
      JSON.stringify(sub.scores), // flatten the scores object as JSON
      sub.comments ? sub.comments : '',
      sub.is_scored,
      sub.queuePosition,
    ].join(',');
  });
  return headers.join(',') + '\n' + rows.join('\n');
}

/**
 * Main function: generate submissions, convert to CSV, and save to file.
 */
export async function generateAndSaveSubmissions(): Promise<Submission[]> {
  const submissions = await generateSubmissions();
  const csvString = convertSubmissionsToCSV(submissions);
  await fs.writeFile('submissions.csv', csvString, 'utf8');
  console.log('Submissions saved to submissions.csv');
  return submissions;
}
