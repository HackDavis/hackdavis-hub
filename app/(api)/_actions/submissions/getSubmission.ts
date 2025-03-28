'use server';

import {
  GetManySubmissions,
  GetSubmission,
} from '@datalib/submissions/getSubmissions';
import parseAndReplace from '@utils/request/parseAndReplace';

export async function getSubmission(judge_id: string, team_id: string) {
  return JSON.parse(JSON.stringify(await GetSubmission(judge_id, team_id)));
}

export async function getManySubmissions(query: object = {}) {
  const newQuery = await parseAndReplace(query);
  const submsissions = JSON.parse(
    JSON.stringify(await GetManySubmissions(newQuery))
  );
  return submsissions;
}
