'use server';

import JudgeToTeam from '@typeDefs/judgeToTeam';
import { GetManySubmissions } from '@datalib/submissions/getSubmissions';
import { CreateSubmission } from '@datalib/submissions/createSubmission';
import { GetManyTeams } from '@datalib/teams/getTeam';
import parseAndReplace from '@utils/request/parseAndReplace';
import checkMatches from '@actions/logic/checkMatches';

/**
 * Given a chosen alpha and its precomputed judge–team pairs,
 * clear/no‑op if existing submissions, validate, then persist.
 */
export default async function applyDiagnosticAlpha(options: {
  alpha: number;
  judgeToTeam: JudgeToTeam[];
}): Promise<{ ok: boolean; body: JudgeToTeam[] | null; error: string | null }> {
  const existing = await GetManySubmissions();
  if (existing.ok && existing.body && existing.body.length > 0) {
    return {
      ok: false,
      body: null,
      error:
        'Submissions collection is not empty. Please clear before applying diagnostics.',
    };
  }
  const teamsRes = await GetManyTeams();
  if (!teamsRes.ok) {
    return {
      ok: false,
      body: null,
      error: `GetManyTeams error: ${teamsRes.error}`,
    };
  }
  const teams = teamsRes.body;
  const parsedSubmissions = await parseAndReplace(options.judgeToTeam);
  if (!checkMatches(parsedSubmissions, teams.length)) {
    return {
      ok: false,
      body: null,
      error: `Invalid assignments for alpha ${options.alpha}.`,
    };
  }

  for (const submission of parsedSubmissions) {
    const res = await CreateSubmission({
      judge_id: { '*convertId': { id: submission.judge_id } },
      team_id: { '*convertId': { id: submission.team_id } },
    });
    if (!res.ok) {
      return { ok: false, body: null, error: res.error };
    }
  }

  return { ok: true, body: options.judgeToTeam, error: null };
}
