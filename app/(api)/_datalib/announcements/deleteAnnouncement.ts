import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import { HttpError, NotFoundError } from '@utils/response/Errors';
import { ObjectId } from 'mongodb';

export async function DeleteAnnouncement(id: string) {
  try {
    const db = await getDatabase();
    const objectId = new ObjectId(id);

    const deletion = await db.collection('announcements').deleteOne({
      _id: objectId,
    });

    if (deletion.deletedCount === 0) {
      throw new NotFoundError(
        `Could not delete announcement with ID: '${id}'. Announcement does not exist or ID is incorrect.`
      );
    }

    return {
      ok: true,
      body: 'Announcement deleted.',
      error: null,
    };
  } catch (e) {
    const error = e as HttpError;
    return {
      ok: false,
      body: null,
      error: error.message,
    };
  }
}
