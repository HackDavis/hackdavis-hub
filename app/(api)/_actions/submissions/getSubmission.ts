'use server';

import {
  GetManySubmissions,
  GetSubmission,
} from '@datalib/submissions/getSubmissions';
import parseAndReplace from '@utils/request/parseAndReplace';
import { serializeMongoData } from '@utils/serialize/serialization';

// TODO: replace parse and stringify with daniel's serialization util
export async function getSubmission(judge_id: string, team_id: string) {
  const submission = await GetSubmission(judge_id, team_id);
  return serializeMongoData(submission);
}

export async function getManySubmissions(query: object = {}) {
  const newQuery = await parseAndReplace(query);
  const submissions = await GetManySubmissions(newQuery);
  return JSON.parse(JSON.stringify(submissions));
}
