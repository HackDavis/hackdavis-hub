import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import { HttpError, NotFoundError } from '@utils/response/Errors';
import { ObjectId } from 'mongodb';

export async function deleteEvent(id: string) {
  try {
    const db = await getDatabase();
    const objectId = ObjectId.createFromHexString(id);

    const deletion = await db.collection('events').deleteOne({
      _id: objectId,
    });

    if (deletion.deletedCount === 0) {
      throw new NotFoundError(
        `Could not delete event with ID: '${id}'. Event does not exist or ID is incorrect.`
      );
    }

    return {
      ok: true,
      body: null,
      error: null,
    };
  } catch (e) {
    const error = e as HttpError;
    return {
      ok: false,
      body: null,
      error: error.message || 'Internal Server Error',
    };
  }
}
