'use server';

import { getManyJudges } from '@actions/judges/getJudge';
import { CreateJudgeGroup } from '@datalib/judgeGroups/createJudgeGroup';
import groupingAlgorithm from '@utils/grouping/groupingAlgorithm';
import HttpError from '@utils/response/HttpError';

export default async function groupJudges() {
  const judges = await getManyJudges();
  const groups = groupingAlgorithm(judges.body);

  try {
    const allPromises = await Promise.all(
      groups.map(async (group) => {
        return await CreateJudgeGroup(group);
      })
    );

    const errors = allPromises.filter((res) => res.ok === false);
    if (errors.length) {
      throw new Error(
        `Judge group creation failed\n${errors.map((res) => res.error)}`
      );
    }

    return { ok: true, body: 'judge groups created', error: null };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
}
