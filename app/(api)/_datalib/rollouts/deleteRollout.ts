import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import { ObjectId } from 'mongodb';
import { NotFoundError, HttpError } from '@utils/response/Errors';

export default async function deleteRollout(id: string) {
  try {
    const object_id = new ObjectId(id);
    const db = await getDatabase();

    const deleteStatus = await db.collection('rollouts').deleteOne({
      _id: object_id,
    });

    if (deleteStatus.deletedCount === 0) {
      throw new NotFoundError(`Rollout with id: ${id} not found.`);
    }

    return { ok: true, body: 'Rollout deleted.', error: null };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
}
