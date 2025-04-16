// @actions/logic/matchTeams.ts
import User from '@typeDefs/user';
import JudgeToTeam from '@typeDefs/judgeToTeam';
import Team from '@typeDefs/team';
import { categorizedTracks, uncategorizedTracks } from '@data/tracks';

import { getManyUsers } from '@actions/users/getUser';
import { getManyTeams } from '@actions/teams/getTeams';

interface Judge {
  user: User;
  domainMatchScores: { [domain: string]: number }; // Higher score means better expertise.
  teamsAssigned: number;
  priority: number;
}

const trackMap = new Map<string, string>(
  Object.values(categorizedTracks).map((track) => [
    track.name,
    track.domain ?? '',
  ])
);

// Helper: Get specialty match score for a given team and judge for the specified track index.
function getSpecialtyMatchScore(
  team: Team,
  judge: Judge,
  trackIndex: number
): number {
  const domain =
    team.tracks && team.tracks.length > trackIndex
      ? team.tracks[trackIndex]
      : null;
  return domain ? judge.domainMatchScores[domain] ?? 0 : 0;
}

// Update the judges' priority based on the current team's track domain.
function updateQueue(
  team: Team,
  trackIndex: number,
  judges: Judge[],
  ALPHA: number
): void {
  for (const judge of judges) {
    const specialtyScore = getSpecialtyMatchScore(team, judge, trackIndex);
    judge.priority = ALPHA * specialtyScore - judge.teamsAssigned;
  }
  judges.sort((a, b) => b.priority - a.priority);
}

/**
 * Match teams with judges and return an array of minimal judgeToTeam.
 * Each submission only contains the judge_id and team_id.
 */
export default async function matchAllTeams(options?: {
  alpha?: number;
}): Promise<{
  judgeToTeam: JudgeToTeam[];
  extraAssignmentsMap: Record<string, number>;
  judgeTeamDistribution: {
    sum: number;
    count: number;
    average: number;
    min: number;
    max: number;
  };
  matchStats: { [avg: string]: number };
  matchQualityStats: {
    [teamId: string]: {
      sum: number;
      average: number;
      min: number;
      max: number;
      count: number;
      teamTracks: string[];
      judgeTracks: string[];
    };
  };
}> {
  const ALPHA = options?.alpha ?? 4;
  // Fetch all checked in judges.
  const judgesResponse = await getManyUsers({
    role: 'judge',
    has_checked_in: true,
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
            // acc[domain] = index === 0 ? 1 : 1 / index; // old
            // acc[domain] = 1 - index / 6;
            acc[domain] = 1 / (index + 1);
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

  // Create a lookup for teams by id.
  const teamById: Record<string, Team> = {};
  modifiedTeams.forEach((team) => {
    if (team._id) {
      teamById[team._id] = team;
    }
  });

  // Convert each team's tracks from name to domain and keep only unique values.
  modifiedTeams.forEach((team) => {
    if (team.tracks && team.tracks.length) {
      // Remove any tracks that are in the uncategorizedTracks keys.
      const filteredTrackNames = team.tracks.filter(
        (trackName: string) =>
          !Object.keys(uncategorizedTracks).includes(trackName)
      );
      team.tracks = Array.from(
        new Set(
          filteredTrackNames
            .map((trackName: string) => trackMap.get(trackName) ?? null)
            .filter(
              (track: string | null): track is string =>
                track !== null &&
                track !== 'Best Hack for Social Good' &&
                track !== "Hacker's Choice Award"
            )
        )
      );
    }
  });

  console.log('Number of judges:', judgesQueue.length);
  console.log('Number of teams:', modifiedTeams.length);

  // Arrays to hold submissions and track issues.
  const judgeToTeam: JudgeToTeam[] = [];
  const teamMatchQualities: { [teamId: string]: number[] } = {};
  const teamJudgeTrackTypes: { [teamId: string]: string[] } = {};

  const rounds = 3;

  const extraAssignmentsMap = Object.fromEntries(
    modifiedTeams
      .filter((team) => team.tracks.length < rounds)
      .map((team) => [team._id ?? '', team.tracks.length - rounds])
  );
  console.log(extraAssignmentsMap);
  // Main loop: process each team for each round.
  for (let i = 0; i < rounds; i++) {
    for (const team of modifiedTeams) {
      // if (!team.tracks || team.tracks.length === 0 || !team.tracks[i]) {
      //   extraAssignmentsMap[team._id ?? String(team.tableNumber)] =
      //     (extraAssignmentsMap[team._id ?? String(team.tableNumber)] || 0) + 1;
      //   continue;
      // }

      const trackIndex = i;
      updateQueue(team, trackIndex, judgesQueue, ALPHA);
      const trackUsed = team.tracks[trackIndex];

      let selectedJudge: Judge | undefined = undefined;
      for (const judge of judgesQueue) {
        const duplicateExists = judgeToTeam.some(
          (entry) =>
            (entry.judge_id as Record<string, { id: string }>)['*convertId']
              .id === judge.user._id?.toString() &&
            (entry.team_id as Record<string, { id: string }>)['*convertId']
              .id === team._id
        );
        if (!duplicateExists) {
          selectedJudge = judge;
          break;
        } else {
          console.log('Duplicate averted');
        }
      }
      if (!selectedJudge) {
        throw new Error(
          `No available unique judge for team ${team._id} in round ${i + 1}`
        );
      }

      const matchQuality = getSpecialtyMatchScore(
        team,
        selectedJudge,
        trackIndex
      );
      const teamId = team._id as string;
      if (!teamMatchQualities[teamId]) {
        teamMatchQualities[teamId] = [];
      }
      teamMatchQualities[teamId].push(matchQuality);
      if (!teamJudgeTrackTypes[teamId]) {
        teamJudgeTrackTypes[teamId] = [];
      }
      teamJudgeTrackTypes[teamId].push(trackUsed);

      const submission: JudgeToTeam = {
        judge_id: { '*convertId': { id: selectedJudge.user._id?.toString() } },
        team_id: { '*convertId': { id: team._id } },
      };
      judgeToTeam.push(submission);
      selectedJudge.teamsAssigned += 1;
    }
  }

  console.log(
    'No. of judgeToTeam before processing extra assignments:',
    judgeToTeam.length
  );

  for (let i = 0; i < rounds; i++) {
    // Process missing assignments from rounds where a team lacked a track.
    for (const [_, [teamId, numRounds]] of Object.entries(
      extraAssignmentsMap
    ).entries()) {
      if (i > numRounds - 1) {
        continue;
      }
      const team = modifiedTeams.find((t) => t._id === teamId);
      if (!team) continue;
      // Use the last available track.
      const trackIndex = team.tracks.length - 1;
      updateQueue(team, trackIndex, judgesQueue, ALPHA);
      const trackUsed = team.tracks[trackIndex];

      let selectedJudge: Judge | undefined = undefined;
      for (const judge of judgesQueue) {
        const duplicateExists = judgeToTeam.some(
          (entry) =>
            (entry.judge_id as Record<string, { id: string }>)['*convertId']
              .id === judge.user._id?.toString() &&
            (entry.team_id as Record<string, { id: string }>)['*convertId']
              .id === team._id
        );
        if (!duplicateExists) {
          selectedJudge = judge;
          break;
        }
      }
      if (!selectedJudge) {
        throw new Error(
          `No available unique judge for team ${
            team._id
          } during supplemental assignment for round ${i + 1}.`
        );
      }

      const matchQuality = getSpecialtyMatchScore(
        team,
        selectedJudge,
        trackIndex
      );
      if (!teamMatchQualities[teamId]) {
        teamMatchQualities[teamId] = [];
      }
      teamMatchQualities[teamId].push(matchQuality);
      if (!teamJudgeTrackTypes[teamId]) {
        teamJudgeTrackTypes[teamId] = [];
      }
      teamJudgeTrackTypes[teamId].push(trackUsed);

      const submission: JudgeToTeam = {
        judge_id: { '*convertId': { id: selectedJudge.user._id?.toString() } },
        team_id: { '*convertId': { id: team._id } },
      };
      judgeToTeam.push(submission);
      selectedJudge.teamsAssigned += 1;
    }
  }
  console.log(
    'No. of judgeToTeam after accounting for missing assignments:',
    judgeToTeam.length
  );

  const judgeAssignments = judgesQueue.map((judge) => judge.teamsAssigned);
  const judgeTeamDistribution = {
    sum: judgeAssignments.reduce((acc, curr) => acc + curr, 0),
    count: judgeAssignments.length,
    average:
      judgeAssignments.reduce((acc, curr) => acc + curr, 0) /
      judgeAssignments.length,
    min: Math.min(...judgeAssignments),
    max: Math.max(...judgeAssignments),
    numJudges: judgesQueue.length,
    numTeams: modifiedTeams.length,
  };

  // Compute match quality statistics for each team.
  const matchQualityStats: {
    [teamId: string]: {
      sum: number;
      average: number;
      min: number;
      max: number;
      count: number;
      teamTracks: string[];
      judgeTracks: string[];
    };
  } = {};
  for (const teamId in teamMatchQualities) {
    const qualities = teamMatchQualities[teamId];
    const sum = qualities.reduce((a, b) => a + b, 0);
    const count = qualities.length;
    const average = count > 0 ? sum / count : 0;
    const min = Math.min(...qualities);
    const max = Math.max(...qualities);
    const teamTracks = teamById[teamId]?.tracks || [];
    const judgeTracks = teamJudgeTrackTypes[teamId] || [];
    matchQualityStats[teamId] = {
      sum,
      average,
      min,
      max,
      count,
      teamTracks,
      judgeTracks,
    };
  }

  // Compute overall match stats: count teams per unique average match quality.
  const matchStats: { [avg: string]: number } = {};
  for (const teamId in matchQualityStats) {
    const avg = matchQualityStats[teamId].average;
    const avgKey = avg.toString();
    matchStats[avgKey] = (matchStats[avgKey] || 0) + 1;
  }

  return {
    judgeToTeam,
    judgeTeamDistribution,
    extraAssignmentsMap,
    matchStats,
    matchQualityStats,
  };
}
