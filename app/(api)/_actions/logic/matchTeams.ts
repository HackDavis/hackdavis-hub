'use server';

import { getManyTeams } from '@actions/teams/getTeams';
import { CreateSubmission } from '@datalib/submissions/createSubmission';
import JudgeToTeam from '@typeDefs/judgeToTeam';
import Submission from '@typeDefs/submission';
import matchAllTeams from '@utils/grouping/matchingAlgorithm';
import parseAndReplace from '@utils/request/parseAndReplace';
import { getManySubmissions } from '@actions/submissions/getSubmission'; // New import

function checkMatches(matches: Submission[], teamsLength: number) {
  if (matches.length < 3 * teamsLength) return false;

  let valid = true;
  const mp: Map<string, number> = new Map();
  for (const match of matches) {
    const teamKey = match.team_id.toString();
    if (mp.get(teamKey) === undefined) {
      mp.set(teamKey, 1);
    } else {
      mp.set(teamKey, mp.get(teamKey)! + 1);
    }
  }

  mp.forEach((count) => {
    if (count !== 3) valid = false;
  });

  return valid;
}

export default async function matchTeams(
  options: { alpha: number } = { alpha: 4 }
) {
  const submissionsResponse = await getManySubmissions();
  if (
    submissionsResponse.ok &&
    submissionsResponse.body &&
    submissionsResponse.body.length > 0
  ) {
    return JSON.stringify({
      error:
        'Submissions collection is not empty. Please clear submissions before matching teams.',
    });
  }

  // Generate submissions based on judge-team assignments.
  const teams = (await getManyTeams()).body;

  const matchResults = await matchAllTeams({ alpha: options.alpha });
  const judgeToTeam: JudgeToTeam[] = matchResults.judgeToTeam;
  const parsedJudgeToTeam = await parseAndReplace(judgeToTeam);
  const valid = checkMatches(parsedJudgeToTeam, teams.length);
  if (valid) {
    for (const submission of parsedJudgeToTeam) {
      const res = await CreateSubmission({
        judge_id: submission.judge_id,
        team_id: submission.team_id,
      });
      if (!res.ok) {
        console.error(res.error);
      }
    }
  }

  return JSON.stringify(matchResults);
}
