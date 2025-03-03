'use server';

import {
  GetManySubmissions,
  GetSubmission,
  GetJudgeSubmissions,
} from '@datalib/submissions/getSubmissions';
import parseAndReplace from '@utils/request/parseAndReplace';
import { serializeMongoData } from '@utils/serialize/serialization';

export async function getSubmission(judge_id: string, team_id: string) {
  const submission = await GetSubmission(judge_id, team_id);
  return serializeMongoData(submission);
}

export async function getManySubmissions(query: object = {}) {
  const newQuery = await parseAndReplace(query);
  const submissions = await GetManySubmissions(newQuery);
  return serializeMongoData(submissions);
}

export async function getJudgeSubmissions(judge_id: string) {
  const submissions = await GetJudgeSubmissions(judge_id);
  return serializeMongoData(submissions);
}
