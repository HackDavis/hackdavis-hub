import { ObjectId } from 'mongodb';
import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import { NotFoundError, HttpError } from '@utils/response/Errors';

export const DeleteManyJudgeGroups = async (query: object = {}) => {
  try {
    const db = await getDatabase();

    await db.collection('judgeGroups').deleteMany(query);

    await db
      .collection('judges')
      .updateMany(query, { $unset: { judge_group_id: '' } });

    return { ok: true, body: 'Judge Groups deleted', error: null };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
};

export const DeleteJudgeGroup = async (id: string) => {
  try {
    const object_id = new ObjectId(id);
    const db = await getDatabase();

    const deleteStatus = await db.collection('judgeGroups').deleteOne({
      _id: object_id,
    });

    if (deleteStatus.deletedCount === 0) {
      throw new NotFoundError(`judge-pair with id: ${id} not found.`);
    }

    // update judges
    await db
      .collection('judges')
      .updateMany(
        { judge_group_id: object_id },
        { $unset: { judge_group_id: '' } }
      );

    return { ok: true, body: 'Judge Group deleted', error: null };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
};
