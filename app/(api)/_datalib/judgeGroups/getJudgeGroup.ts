import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import { HttpError, NotFoundError } from '@utils/response/Errors';
import { ObjectId } from 'mongodb';

export const GetJudgeGroup = async (id: string) => {
  try {
    const judge_group_id = new ObjectId(id);
    const db = await getDatabase();

    const judgeGroups = await db
      .collection('judgeGroups')
      .aggregate([
        {
          $match: {
            _id: judge_group_id,
          },
        },
        {
          $lookup: {
            from: 'judgeGroupToTeams',
            localField: '_id',
            foreignField: 'judge_group_id',
            as: 'judgeGroupsToTeams',
          },
        },
        {
          $lookup: {
            from: 'teams',
            localField: 'judgeGroupsToTeams.team_id',
            foreignField: '_id',
            as: 'teams',
          },
        },
        {
          $lookup: {
            from: 'judges',
            localField: '_id',
            foreignField: 'judge_group_id',
            as: 'judges',
          },
        },
      ])
      .project({ judgeGroupsToTeams: 0, 'judges.judge_group_id': 0 })
      .toArray();

    if (judgeGroups.length === 0) {
      throw new NotFoundError('Judge group not found');
    }

    return { ok: true, body: judgeGroups[0], error: null };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
};

export const GetManyJudgeGroups = async (query: object = {}) => {
  try {
    const db = await getDatabase();

    const judgeGroups = await db
      .collection('judgeGroups')
      .aggregate([
        {
          $match: query,
        },
        {
          $lookup: {
            from: 'judgeGroupToTeams',
            localField: '_id',
            foreignField: 'judge_group_id',
            as: 'judgeGroupsToTeams',
          },
        },
        {
          $lookup: {
            from: 'teams',
            localField: 'judgeGroupsToTeams.team_id',
            foreignField: '_id',
            as: 'teams',
          },
        },
        {
          $lookup: {
            from: 'judges',
            localField: '_id',
            foreignField: 'judge_group_id',
            as: 'judges',
          },
        },
      ])
      .project({ judgeGroupsToTeams: 0, 'judges.judge_group_id': 0 })
      .toArray();

    return { ok: true, body: judgeGroups, error: null };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
};
