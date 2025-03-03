'use server';

import { GetManySubmissions } from '@datalib/submissions/getSubmissions';
import Submission from '@typeDefs/submission';

export async function getTeamsForAJudge(judge_id: string) {
  const submissions = await GetManySubmissions({ judge_id });
  if (!submissions.ok) {
    return { ok: false, body: null, error: submissions.error };
  }
  const teams = submissions.body.map(
    (submission: Submission) => submission.team_id
  );
  return { ok: true, body: teams, error: null };
}
