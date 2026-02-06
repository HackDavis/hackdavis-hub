'use server';

import JudgeToTeam from '@typeDefs/judgeToTeam';
import { GetManySubmissions } from '@datalib/submissions/getSubmissions';
import { CreateManySubmissions } from '@datalib/submissions/createSubmission';
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
}): Promise<{
  ok: boolean;
  body: JudgeToTeam[] | null;
  error: string | null;
  message?: string;
}> {
  const existing = await GetManySubmissions();
  const teamsRes = await GetManyTeams();
  if (!teamsRes.ok) {
    return {
      ok: false,
      body: null,
      error: `GetManyTeams error: ${teamsRes.error}`,
    };
  }
  const teams = teamsRes.body;
  const existingCount = existing.ok && existing.body ? existing.body.length : 0;
  const maxTotalAssignmentsPerTeam = 4;
  const maxSubmissions = teams.length * maxTotalAssignmentsPerTeam;
  const isSecondRound = existingCount > 0;

  if (existingCount >= maxSubmissions) {
    return {
      ok: false,
      body: null,
      error:
        'Maximum judge assignments reached (4 judges per team). Clear submissions to rerun.',
    };
  }
  const parsedSubmissions = await parseAndReplace(options.judgeToTeam);
  if (!checkMatches(parsedSubmissions, teams.length)) {
    return {
      ok: false,
      body: null,
      error: `Invalid assignments for alpha ${options.alpha}.`,
    };
  }
  for (const submission of parsedSubmissions) {
    submission.judge_id = { '*convertId': { id: submission.judge_id } };
    submission.team_id = { '*convertId': { id: submission.team_id } };
  }
  const res = await CreateManySubmissions(parsedSubmissions);
  if (!res.ok) {
    return {
      ok: false,
      body: null,
      error: `Invalid submissions. ${res.error}`,
    };
  }
  // for (const submission of parsedSubmissions) {
  //   const res = await CreateSubmission({
  //     judge_id: { '*convertId': { id: submission.judge_id } },
  //     team_id: { '*convertId': { id: submission.team_id } },
  //   });
  //   if (!res.ok) {
  //     return { ok: false, body: null, error: res.error };
  //   }

  return {
    ok: true,
    body: options.judgeToTeam,
    error: null,
    message: isSecondRound
      ? 'Second round detected: new pairings were added on top of existing submissions.'
      : undefined,
  };
}
