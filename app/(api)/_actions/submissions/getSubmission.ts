'use server';

import {
  GetManySubmissions,
  GetSubmission,
} from '@datalib/submissions/getSubmissions';
import parseAndReplace from '@utils/request/parseAndReplace';

export async function getSubmission(judge_id: string, team_id: string) {
  return GetSubmission(judge_id, team_id);
}

export async function getManySubmissions(query: object = {}) {
  const newQuery = await parseAndReplace(query);
  return GetManySubmissions(newQuery);
}
