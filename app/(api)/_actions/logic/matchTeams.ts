'use server';

import JudgeToTeam from '@typeDefs/judgeToTeam';
import matchAllTeams from '@utils/matching/judgesToTeamsAlgorithm';
import parseAndReplace from '@utils/request/parseAndReplace';
import { GetManyTeams } from '@datalib/teams/getTeam';
import { CreateSubmission } from '@datalib/submissions/createSubmission';
import { GetManySubmissions } from '@datalib/submissions/getSubmissions';
import checkMatches from '@actions/logic/checkMatches';

export default async function matchTeams(
  options: { alpha: number } = { alpha: 4 }
) {
  const submissionsResponse = await GetManySubmissions();
  if (
    submissionsResponse.ok &&
    submissionsResponse.body &&
    submissionsResponse.body.length > 0
  ) {
    return {
      ok: false,
      body: null,
      error:
        'Submissions collection is not empty. Please clear submissions before matching teams.',
    };
  }

  // Generate submissions based on judge-team assignments.
  const teamsRes = await GetManyTeams();
  if (!teamsRes.ok) {
    return {
      ok: false,
      body: null,
      error: `GetManyTeams error: ${teamsRes.error}`,
    };
  }
  const teams = teamsRes.body;
  const matchResults = await matchAllTeams({ alpha: options.alpha });
  const judgeToTeam: JudgeToTeam[] = matchResults.judgeToTeam;
  const parsedJudgeToTeam = await parseAndReplace(judgeToTeam);
  const valid = checkMatches(parsedJudgeToTeam, teams.length);
  if (valid) {
    for (const submission of parsedJudgeToTeam) {
      const res = await CreateSubmission({
        judge_id: { '*convertId': { id: submission.judge_id } },
        team_id: { '*convertId': { id: submission.team_id } },
      });
      if (!res.ok) {
        console.error(res.error);
      }
    }
  } else {
    return {
      ok: false,
      body: null,
      error: 'Invalid submissions.',
    };
  }
  return {
    ok: true,
    body: JSON.parse(JSON.stringify(matchResults)),
    error: null,
  };
}
