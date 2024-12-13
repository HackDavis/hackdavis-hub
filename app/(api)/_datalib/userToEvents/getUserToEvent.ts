import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import { HttpError } from '@utils/response/Errors';

export const GetUserToEvents = async (query: object = {}) => {
  try {
    const db = await getDatabase();

    const userEvents = await db
      .collection('userToEvents')
      .aggregate([
        {
          $match: query,
        },
        {
          $lookup: {
            from: 'events',
            localField: 'event_id',
            foreignField: '_id',
            as: 'events',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'users',
          },
        },
      ])
      .toArray();

    return { ok: true, body: userEvents, error: null };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
};
