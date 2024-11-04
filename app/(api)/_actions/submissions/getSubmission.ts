'use server';

import {
  GetManySubmissions,
  GetSubmission,
} from '@datalib/submissions/getSubmissions';
import parseAndReplace from '@utils/request/parseAndReplace';

export async function getSubmission(judge_id: string, team_id: string) {
  const submission = await GetSubmission(judge_id, team_id);
  return submission;
}

export async function getManySubmissions(query: object = {}) {
  const newQuery = await parseAndReplace(query);
  const submissions = await GetManySubmissions(newQuery);
  return submissions;
}
