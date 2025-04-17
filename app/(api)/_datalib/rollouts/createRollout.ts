import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import Rollout from '@typeDefs/rollout';
import { DuplicateError, HttpError } from '@utils/response/Errors';

export default async function CreateRollout(body: Rollout) {
  try {
    const db = await getDatabase();

    const existing = await db
      .collection('rollouts')
      .findOne({ component_key: body.component_key });

    if (existing) {
      throw new DuplicateError(
        `Duplicate: rollout for ${
          body.component_key
        } component already exists with rollout_time ${new Date(
          existing.rollout_time
        )}.`
      );
    }

    const creationStatus = await db.collection('rollouts').insertOne(body);

    const rollout = await db.collection('rollouts').findOne({
      _id: creationStatus.insertedId,
    });

    return {
      ok: true,
      body: rollout,
      error: null,
    };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
}
