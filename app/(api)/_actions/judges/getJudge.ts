'use server';
import { GetJudge, GetManyJudges } from '@datalib/judges/getJudge';

export async function getJudge(id: string) {
  const judgeRes = await GetJudge(id);
  return judgeRes;
}

export async function getManyJudges(query: object = {}) {
  const judgeRes = await GetManyJudges(query);
  return judgeRes;
}
