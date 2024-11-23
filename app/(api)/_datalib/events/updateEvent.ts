import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import { ObjectId } from 'mongodb';
import isBodyEmpty from '@utils/request/isBodyEmpty';
import parseAndReplace from '@utils/request/parseAndReplace';
import {
  HttpError,
  NoContentError,
  NotFoundError,
} from '@utils/response/Errors';

export async function UpdateEvent(id: string, body: object) {
  try {
    if (isBodyEmpty(body)) {
      throw new NoContentError();
    }

    const db = await getDatabase();
    const objectId = ObjectId.createFromHexString(id);
    const parsedBody = await parseAndReplace(body);

    const event = await db
      .collection('users')
      .updateOne({ _id: objectId }, parsedBody);

    if (event.matchedCount === 0) {
      throw new NotFoundError(
        `Could not update event with ID: '${id}'. Event does not exist or ID is incorrect.`
      );
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
      error: error.message || 'Internal Server Error',
    };
  }
}
