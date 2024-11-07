'use server';

import {
  GetJudgeGroup,
  GetManyJudgeGroups,
} from '@datalib/judgeGroups/getJudgeGroup';
import parseAndReplace from '@utils/request/parseAndReplace';

export async function getJudgeGroup(group_id: string) {
  const judgeGroupRes = await GetJudgeGroup(group_id);
  return judgeGroupRes;
}

export async function getManyJudgeGroups(query: object = {}) {
  const newQuery = await parseAndReplace(query);
  const judgeGroupRes = await GetManyJudgeGroups(newQuery);
  return judgeGroupRes;
}
