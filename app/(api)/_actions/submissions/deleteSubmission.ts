'use server';

import {
  DeleteManySubmissions,
  DeleteSubmission,
} from '@datalib/submissions/deleteSubmission';
import parseAndReplace from '@utils/request/parseAndReplace';

export async function deleteSubmission(judge_id: string, team_id: string) {
  return DeleteSubmission(judge_id, team_id);
}

export default async function deleteManySubmissions(query: object = {}) {
  const newQuery = await parseAndReplace(query);
  return DeleteManySubmissions(newQuery);
}
