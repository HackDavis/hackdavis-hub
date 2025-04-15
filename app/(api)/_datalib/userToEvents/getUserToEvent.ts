import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import { HttpError } from '@utils/response/Errors';
import parseAndReplace from '@utils/request/parseAndReplace';

export const GetUserToEvents = async (query: object = {}) => {
  try {
    const db = await getDatabase();
    const parsedQuery = await parseAndReplace(query);

    const userEvents = await db
      .collection('userToEvents')
      .aggregate([
        {
          $match: parsedQuery,
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

    if (userEvents.length === 0) {
      throw new HttpError(
        'No matching userToEvent found for the provided query.'
      );
    }

    return { ok: true, body: userEvents, error: null };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
};
