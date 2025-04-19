import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import { HttpError, NotFoundError } from '@utils/response/Errors';
import { ObjectId } from 'mongodb';

export async function GetAnnouncement(id: string) {
  try {
    const db = await getDatabase();
    const objectId = ObjectId.createFromHexString(id);
    const announcement = await db
      .collection('announcements')
      .findOne({ _id: objectId });

    if (!announcement) {
      throw new NotFoundError(`Announcement with id: ${id} not found.`);
    }

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

export async function GetManyAnnouncements(query: object) {
  try {
    const db = await getDatabase();
    const announcements = await db
      .collection('announcements')
      .find(query)
      .toArray();

    return {
      ok: true,
      body: announcements,
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
