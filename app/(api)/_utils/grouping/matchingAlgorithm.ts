// @actions/logic/matchTeams.ts
import User from '@typeDefs/user';
import Submission from '@typeDefs/submission';
import Team from '@typeDefs/team';
import tracks from '@apidata/tracks.json' assert { type: 'json' };

import { getManyUsers } from '@actions/users/getUser';
import { getManyTeams } from '@actions/teams/getTeams';

interface Judge {
  user: User;
  domainMatchScores: { [domain: string]: number }; // Higher score means better expertise.
  teamsAssigned: number;
  priority: number;
}

// Build a map from track name to track type.
const trackMap = new Map<string, string>(
  tracks.map((track: { name: string; type: string }) => [
    track.name,
    track.type,
  ])
);

const ALPHA = 2;

/**
 * Match teams with judges and return an array of minimal submissions.
 * Each submission only contains the judge_id and team_id.
 */
export default async function matchAllTeams(): Promise<{
  submissions: Submission[];
  teamsWithNoTracks: string[];
}> {
  // Fetch all judges.
  const judgesResponse = await getManyUsers({
    role: 'judge',
    has_checked_in: false, // TODO: CHANGE THIS LATER TO CHECKED IN FOR DOE
  });
  if (!judgesResponse.ok) {
    throw new Error(`Failed to fetch judges: ${judgesResponse.error}`);
  }
  const users = judgesResponse.body as User[];

  // Convert fetched users into Judge objects.
  const judgesQueue: Judge[] = users.map((user) => ({
    user,
    domainMatchScores: user.specialties
      ? user.specialties.reduce(
          (acc, domain, index) => {
            // Assign a decreasing score for each ranked domain.
            acc[domain] = 1 / index;
            return acc;
          },
          {} as { [domain: string]: number }
        )
      : {},
    teamsAssigned: 0,
    priority: 0,
  }));

  // Fetch teams.
  const teamsResponse = await getManyTeams();
  if (!teamsResponse.ok) {
    throw new Error(`Failed to fetch teams: ${teamsResponse.error}`);
  }
  const modifiedTeams = teamsResponse.body as Team[];

  // Convert each team's tracks from name to type and keep only unique values.
  modifiedTeams.forEach((team) => {
    if (team.tracks && team.tracks.length) {
      team.tracks = Array.from(
        new Set(
          team.tracks.map(
            (trackName: string) => trackMap.get(trackName) || trackName // TODO: make null for not found
          )
        )
      );
    }
  });

  // Log the number of judges and teams.
  console.log('Number of judges:', judgesQueue.length);
  console.log('Number of teams:', modifiedTeams.length);

  // Helper: Get specialty match score for a given team and judge for the specified track index.
  function getSpecialtyMatchScore(
    team: Team,
    judge: Judge,
    trackIndex: number
  ): number {
    // Use the track at index if available.
    const domain =
      team.tracks && team.tracks.length > trackIndex
        ? team.tracks[trackIndex]
        : null;
    // const domain = team?.tracks[trackIndex] || '';
    return domain ? judge.domainMatchScores[domain] ?? 0 : 0;
  }

  // Update the judges' priority based on the current team's track domain.
  function updateQueue(team: Team, trackIndex: number, judges: Judge[]): void {
    for (const judge of judges) {
      const specialtyScore = getSpecialtyMatchScore(team, judge, trackIndex);
      judge.priority = specialtyScore - ALPHA * judge.teamsAssigned;
    }
    judges.sort((a, b) => b.priority - a.priority);
  }

  // Array to hold the minimal submissions.
  const submissions: Submission[] = [];
  const teamsWithNoTracks: string[] = [];

  const rounds = 3;
  for (let i = 0; i < rounds; i++) {
    // For each team, assign a submission for each round.
    // Each team should be judged at least 3 times.
    for (const team of modifiedTeams) {
      if (!team.tracks || team.tracks.length === 0) {
        teamsWithNoTracks.push(team._id ?? String(team.tableNumber));
        console.warn(`Team ${team._id} has no tracks.`);
        continue;
      }
      // If there are fewer unique tracks than rounds, use the last track for extra rounds.
      // const trackIndex = i < team.tracks.length ? i : team.tracks.length - 1;
      const trackIndex = i;
      updateQueue(team, trackIndex, judgesQueue);

      // The judge at index 0 is the best match.
      const selectedJudge = judgesQueue[0];
      if (!selectedJudge) {
        throw new Error(`No judges in queue`);
      }

      // Create a minimal submission with just the judge_id and team_id.
      // const submission: Partial<Submission> = {
      //   judge_id: selectedJudge.user._id as string,
      //   team_id: team._id as string,
      // };

      const submission: Submission = {
        judge_id: selectedJudge.user._id as string,
        team_id: team._id as string,
        social_good: null,
        creativity: null,
        presentation: null,
        scores: [],
        comments: '',
        is_scored: false,
        queuePosition: null,
      };

      submissions.push(submission);
      selectedJudge.teamsAssigned += 1;
    }
  }

  console.log('No. of submissions:', submissions.length);
  return { submissions, teamsWithNoTracks };
}
