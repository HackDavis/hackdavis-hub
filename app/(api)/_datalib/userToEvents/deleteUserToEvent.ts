import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import { HttpError, NotFoundError } from '@utils/response/Errors';
import parseAndReplace from '@utils/request/parseAndReplace';

export const DeleteUserToEvent = async (body: {
  user_id: object;
  event_id: object;
}) => {
  try {
    const db = await getDatabase();
    const parsedBody = await parseAndReplace(body);

    const deleteStatus = await db
      .collection('userToEvents')
      .deleteOne(parsedBody);

    if (deleteStatus.deletedCount === 0) {
      throw new NotFoundError(
        'No matching userToEvent found for the provided query.'
      );
    }

    return {
      ok: true,
      body: 'userToEvent deleted.',
      error: null,
    };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
};

export const DeleteManyUserToEvents = async (query: object = {}) => {
  try {
    const db = await getDatabase();
    const parsedQuery = await parseAndReplace(query);

    const deleteStatus = await db
      .collection('userToEvents')
      .deleteMany(parsedQuery);

    if (deleteStatus.deletedCount === 0) {
      throw new NotFoundError(
        'No matching userToEvent found for the provided query.'
      );
    }

    return {
      ok: true,
      body: `${deleteStatus.deletedCount} userToEvent deleted.`,
      error: null,
    };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
};
