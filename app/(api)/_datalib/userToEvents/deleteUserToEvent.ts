import { ObjectId } from 'mongodb';
import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import { HttpError, NotFoundError } from '@utils/response/Errors';

export const DeleteUserToEvent = async (body: {
  user_id: string;
  event_id: string;
}) => {
  try {
    const db = await getDatabase();
    const user_id = new ObjectId(body.user_id);
    const event_id = new ObjectId(body.event_id);

    const deleteStatus = await db.collection('userToEvents').deleteOne({
      user_id: user_id,
      event_id: event_id,
    });

    if (deleteStatus.deletedCount === 0) {
      throw new NotFoundError(
        `No matching userToEvent found for the provided query.`
      );
    }

    // Confirmation response of deleted count
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
