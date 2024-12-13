import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import { HttpError, NotFoundError } from '@utils/response/Errors';
import { ObjectId } from 'mongodb';

export const GetUser = async (id: string) => {
  try {
    const object_id = new ObjectId(id);
    const db = await getDatabase();

    const user = await db.collection('users').findOne({
      _id: object_id,
    });

    if (user === null) {
      throw new NotFoundError(`user with id: ${id} not found.`);
    }

    return { ok: true, body: user, error: null };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
};

export const GetManyUsers = async (query: object = {}) => {
  try {
    const db = await getDatabase();

    const users = await db.collection('users').find(query).toArray();
    return { ok: true, body: users, error: null };
  } catch (e) {
    const error = e as HttpError;
    return {
      ok: false,
      body: null,
      error: error.message,
      status: error.status,
    };
  }
};
