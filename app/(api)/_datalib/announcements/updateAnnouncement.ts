import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import { ObjectId } from 'mongodb';
import isBodyEmpty from '@utils/request/isBodyEmpty';
import {
  HttpError,
  NoContentError,
  NotFoundError,
} from '@utils/response/Errors';

export async function UpdateAnnouncement(id: string, body: object) {
  try {
    console.log(body);
    const objectId = new ObjectId(id);
    if (isBodyEmpty(body)) {
      throw new NoContentError();
    }

    const db = await getDatabase();

    const existingAnnouncement = await db
      .collection('announcements')
      .findOne({ _id: objectId });

    if (!existingAnnouncement) {
      throw new NotFoundError(
        `Could not update announcement with ID: '${id}'. Announcement does not exist or ID is incorrect.`
      );
    }

    const announcement = await db
      .collection('announcements')
      .updateOne({ _id: objectId }, body);

    return {
      ok: true,
      body: announcement,
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
