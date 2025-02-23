import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import { HttpError, NotFoundError } from '@utils/response/Errors';
import { ObjectId } from 'mongodb';

export async function GetEvent(id: string) {
  try {
    const db = await getDatabase();
    const objectId = ObjectId.createFromHexString(id);
    const event = await db.collection('events').findOne({ _id: objectId });

    if (!event) {
      throw new NotFoundError(`Event with id: ${id} not found.`);
    }

    return {
      ok: true,
      body: event,
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

export async function GetEvents(query: object) {
  try {
    const db = await getDatabase();
    const events = await db.collection('events').find(query).toArray();

    return {
      ok: true,
      body: events,
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
