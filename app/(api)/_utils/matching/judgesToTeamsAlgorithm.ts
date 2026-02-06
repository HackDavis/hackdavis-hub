// @actions/logic/matchTeams.ts
import User from '@typeDefs/user';
import JudgeToTeam from '@typeDefs/judgeToTeam';
import Team from '@typeDefs/team';
import { optedHDTracks, nonHDTracks } from '@data/tracks';

import { GetManyUsers } from '@datalib/users/getUser';
import { GetManyTeams } from '@datalib/teams/getTeam';
import { GetJudgeToTeamPairings } from '@datalib/judgeToTeam/getJudgeToTeamPairings';

interface Judge {
  user: User;
  domainMatchScores: { [track: string]: number }; // Higher score means better expertise.
  teamsAssigned: number;
  priority: number;
}

const domainMap = new Map<string, string>(
  Object.values(optedHDTracks).map((track) => [track.name, track.domain ?? ''])
);

// Helper: Get specialty match score for a given team and judge for the specified domain index.
function getSpecialtyMatchScore(
  domain: string,
  // team: Team,
  judge: Judge
  // domainIndex: number
): number {
  // const domain =
  //   team.tracks && team.tracks.length > domainIndex
  //     ? team.tracks[domainIndex]
  //     : null;
  return domain ? judge.domainMatchScores[domain] ?? 0 : 0;
}

// Update the judges' priority based on the current team's domain domain.
function updateQueue(
  team: Team,
  domainIndex: number,
  judges: Judge[],
  ALPHA: number
): void {
  for (const judge of judges) {
    const specialtyScore = getSpecialtyMatchScore(
      team.tracks[domainIndex],
      judge
    );
    judge.priority = ALPHA * specialtyScore - judge.teamsAssigned;
  }
  judges.sort((a, b) => b.priority - a.priority);
}

function shuffleArray<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/**
 * Match teams with judges and return an array of minimal judgeToTeam.
 * Each submission only contains the judge_id and team_id.
 */
export default async function matchAllTeams(options?: { alpha?: number }) {
  // Arrays to hold submissions and domain issues.
  const judgeToTeam: JudgeToTeam[] = [];
  const teamMatchQualities: { [teamId: string]: number[] } = {};
  const teamJudgeDomainTypes: { [teamId: string]: string[] } = {};

  const rounds = 2;
  const ALPHA = options?.alpha ?? 4;
  // Fetch all checked in judges.
  const judgesResponse = await GetManyUsers({
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
            acc[domain] = 1 / (index + 1); // alpha 5 or 6
            return acc;
          },
          {} as { [domain: string]: number }
        )
      : {},
    teamsAssigned: 0,
    priority: 0,
  }));

  // Fetch teams.
  const teamsResponse = await GetManyTeams();
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

  // Convert each team's domains from name to domain and keep only unique values.
  modifiedTeams.forEach((team) => {
    if (team.tracks && team.tracks.length) {
      // Remove any domains that are in the uncategorizedDomains keys.
      const filteredDomainNames = team.tracks.filter(
        (domainName: string) => !Object.keys(nonHDTracks).includes(domainName)
      );
      team.tracks = Array.from(
        new Set(
          filteredDomainNames
            .map((domainName: string) => domainMap.get(domainName) ?? null)
            .filter(
              (domain: string | null): domain is string =>
                domain !== null &&
                domain !== 'Best Hack for Social Good' &&
                domain !== "Hacker's Choice Award"
            )
        )
      );
    }
    // Ensure the team has exactly three domains (not unique).
    // If it has less than 3, duplicate the first domain 3 times.
    if (!team.tracks || team.tracks.length < rounds) {
      // Use team.tracks[0] if available, otherwise fallback to an empty string.
      if (team.tracks.length === 0) {
        // No domains at all → ["", "", ""]
        team.tracks = Array(rounds).fill('');
      } else {
        // 1 or 2 domains → cycle through them to get exactly `rounds` entries
        team.tracks = Array.from(
          { length: rounds },
          (_, i) => team.tracks[i % team.tracks.length]
        );
      }
    }
  });

  console.log('Number of judges:', judgesQueue.length);
  console.log('Number of teams:', modifiedTeams.length);

  const extraAssignmentsMap = Object.fromEntries(
    modifiedTeams
      .filter((team) => team.tracks.length < rounds)
      .map((team) => [team._id ?? '', rounds - team.tracks.length])
  );

  // Get previous pairings and push it to the judgeToTeam array (so that !duplicateExists is true)
  const previousPairings = await GetJudgeToTeamPairings();
  if (!previousPairings.ok || !previousPairings.body) {
    throw new Error(
      `Failed to load existing judge-to-team pairings: ${
        previousPairings.error ?? 'Unknown error'
      }`
    );
  }
  const previousPairingsBody = previousPairings.body;
  judgeToTeam.push(...previousPairingsBody);

  // Main loop: process each team for each round.
  for (let domainIndex = 0; domainIndex < rounds; domainIndex++) {
    for (const team of modifiedTeams) {
      if (extraAssignmentsMap[team._id ?? ''] >= rounds - domainIndex) {
        continue;
      }
      updateQueue(team, domainIndex, judgesQueue, ALPHA);
      const domainUsed = team.tracks[domainIndex];

      let selectedJudge: Judge | undefined = undefined;
      for (const judge of judgesQueue) {
        // String() conversion is necessary because:
        // - previousPairings from GetJudgeToTeamPairings converts ObjectIds to strings
        // - judge.user._id and team._id are ObjectIds that need .toString()
        // - Comparing without String() would cause false negatives in duplicate detection
        const duplicateExists = judgeToTeam.some(
          (entry) =>
            String(entry.judge_id) === judge.user._id?.toString() &&
            String(entry.team_id) === team._id?.toString()
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
          `No available unique judge for team ${team._id} in round ${
            domainIndex + 1
          }`
        );
      }

      const matchQuality = getSpecialtyMatchScore(
        team.tracks[domainIndex],
        selectedJudge
      );
      const teamId = team._id as string;
      if (!teamMatchQualities[teamId]) {
        teamMatchQualities[teamId] = [];
      }
      teamMatchQualities[teamId].push(matchQuality);
      if (!teamJudgeDomainTypes[teamId]) {
        teamJudgeDomainTypes[teamId] = [];
      }
      teamJudgeDomainTypes[teamId].push(domainUsed);

      const submission: JudgeToTeam = {
        judge_id: selectedJudge.user._id?.toString() || '',
        team_id: team._id?.toString() || '',
      };
      judgeToTeam.push(submission);
      selectedJudge.teamsAssigned += 1;
    }
    shuffleArray(modifiedTeams);
  }

  // Remove the previous pairings without relying on array insertion order.
  if (previousPairingsBody.length > 0) {
    const previousPairingKeySet = new Set(
      previousPairingsBody.map((pairing) => {
        const judgeId = String(pairing.judge_id);
        const teamId = String(pairing.team_id);
        return `${judgeId}::${teamId}`;
      })
    );
    const filteredJudgeToTeam = judgeToTeam.filter((entry) => {
      const judgeId = String(entry.judge_id);
      const teamId = String(entry.team_id);
      const key = `${judgeId}::${teamId}`;
      return !previousPairingKeySet.has(key);
    });
    judgeToTeam.length = 0;
    judgeToTeam.push(...filteredJudgeToTeam);
  }

  console.log('No. of judgeToTeam:', judgeToTeam.length);

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
      teamDomains: string[];
      judgeDomains: string[];
    };
  } = {};
  for (const teamId in teamMatchQualities) {
    const qualities = teamMatchQualities[teamId];
    const sum = qualities.reduce((a, b) => a + b, 0);
    const count = qualities.length;
    const average = count > 0 ? sum / count : 0;
    const min = Math.min(...qualities);
    const max = Math.max(...qualities);
    const teamDomains = teamById[teamId]?.tracks || [];
    const judgeDomains = teamJudgeDomainTypes[teamId] || [];
    matchQualityStats[teamId] = {
      sum,
      average,
      min,
      max,
      count,
      teamDomains,
      judgeDomains,
    };
  }

  // Compute overall match stats: count teams per unique average match quality.
  const matchStats: { [avg: string]: number } = {};
  for (const teamId in matchQualityStats) {
    const avg = matchQualityStats[teamId].average;
    const avgKey = avg.toString();
    matchStats[avgKey] = (matchStats[avgKey] || 0) + 1;
  }
  console.log(extraAssignmentsMap);

  return {
    judgeToTeam,
    judgeTeamDistribution,
    matchStats,
    extraAssignmentsMap,
    matchQualityStats,
  };
}
