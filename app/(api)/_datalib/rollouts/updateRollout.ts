import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import { ObjectId } from 'mongodb';

import isBodyEmpty from '@utils/request/isBodyEmpty';
import {
  HttpError,
  NoContentError,
  NotFoundError,
} from '@utils/response/Errors';

export const UpdateRollout = async (id: string, body: object) => {
  try {
    const object_id = new ObjectId(id);
    if (isBodyEmpty(body)) {
      throw new NoContentError();
    }

    const db = await getDatabase();
    const rollout = await db.collection('rollouts').updateOne(
      {
        _id: object_id,
      },
      body
    );

    if (rollout.matchedCount === 0) {
      throw new NotFoundError(`Rollout with id: ${id} not found.`);
    }

    return { ok: true, body: rollout, error: null };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
};
