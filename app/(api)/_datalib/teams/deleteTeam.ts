import { ObjectId } from 'mongodb';

import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import { NotFoundError, HttpError } from '@utils/response/Errors';

export const DeleteTeam = async (id: string) => {
  try {
    const object_id = new ObjectId(id);
    const db = await getDatabase();

    const deleteStatus = await db.collection('teams').deleteOne({
      _id: object_id,
    });

    if (deleteStatus.deletedCount === 0) {
      throw new NotFoundError(`Team with id: ${id} not found.`);
    }

    return { ok: true, body: 'Team deleted.', error: null };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
};
