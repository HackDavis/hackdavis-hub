import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import { HttpError, NoContentError } from '@utils/response/Errors';
import isBodyEmpty from '@utils/request/isBodyEmpty';

export async function CreateAnnouncement(body: object) {
  try {
    if (isBodyEmpty(body)) {
      throw new NoContentError();
    }

    const db = await getDatabase();

    const creationStatus = await db.collection('announcements').insertOne(body);
    const createdAnnouncement = await db.collection('announcements').findOne({
      _id: creationStatus.insertedId,
    });

    if (!createdAnnouncement) {
      throw new HttpError('Failed to fetch the created announcement');
    }

    return { ok: true, body: createdAnnouncement, error: null };
  } catch (e) {
    const error = e as HttpError;
    return {
      ok: false,
      body: null,
      error: error.message,
    };
  }
}
