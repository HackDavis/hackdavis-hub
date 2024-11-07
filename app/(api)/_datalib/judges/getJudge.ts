import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import { HttpError, NotFoundError } from '@utils/response/Errors';
import { ObjectId } from 'mongodb';

export const GetJudge = async (id: string) => {
  try {
    const object_id = new ObjectId(id);
    const db = await getDatabase();

    const judge = await db.collection('judges').findOne({
      _id: object_id,
    });

    if (judge === null) {
      throw new NotFoundError(`judge with id: ${id} not found.`);
    }

    return { ok: true, body: judge, error: null };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
};

export const GetManyJudges = async (query: object = {}) => {
  try {
    const db = await getDatabase();

    const judge = await db.collection('judges').find(query).toArray();
    return { ok: true, body: judge, error: null };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
};
