import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import { HttpError } from '@utils/response/Errors';

export const GetManyJudgeGroupToTeams = async (query: object = {}) => {
  try {
    const db = await getDatabase();

    const judgeGroupsToTeams = await db
      .collection('judgeGroupToTeams')
      .aggregate([
        {
          $match: query,
        },
        {
          $lookup: {
            from: 'judgeGroups',
            localField: 'judge_group_id',
            foreignField: '_id',
            as: 'judgeGroups',
          },
        },
        {
          $lookup: {
            from: 'teams',
            localField: 'team_id',
            foreignField: '_id',
            as: 'teams',
          },
        },
      ])
      .toArray();

    return { ok: true, body: judgeGroupsToTeams, error: null };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
};
