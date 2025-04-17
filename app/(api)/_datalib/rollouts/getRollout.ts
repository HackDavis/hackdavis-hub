import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import { HttpError, NotFoundError } from '@utils/response/Errors';

export const GetRollout = async (component_key: string) => {
  try {
    const db = await getDatabase();
    const rollouts = await db.collection('rollouts').findOne({
      component_key: component_key,
    });

    if (rollouts === null) {
      throw new NotFoundError(
        `No rollout found for component ${component_key}.`
      );
    }

    return { ok: true, body: rollouts, error: null };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
};

export const GetManyRollouts = async (query: object = {}) => {
  try {
    const db = await getDatabase();

    const rollouts = await db.collection('rollouts').find(query).toArray();
    return { ok: true, body: rollouts, error: null };
  } catch (e) {
    const error = e as HttpError;
    return {
      ok: false,
      body: null,
      error: error.message,
    };
  }
};
