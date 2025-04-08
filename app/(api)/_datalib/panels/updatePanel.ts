import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import isBodyEmpty from '@utils/request/isBodyEmpty';
import parseAndReplace from '@utils/request/parseAndReplace';
import {
  NoContentError,
  NotFoundError,
  HttpError,
} from '@utils/response/Errors';

export const UpdatePanel = async (track: string, body: object) => {
  try {
    if (isBodyEmpty(body)) {
      throw new NoContentError();
    }

    const parsedBody = await parseAndReplace(body);

    const db = await getDatabase();

    const updateStatus = await db
      .collection('panels')
      .updateOne({ track }, parsedBody);

    if (updateStatus.matchedCount === 0) {
      throw new NotFoundError(`Panel with track: ${track} not found.`);
    }

    return { ok: true, body: 'Panel updated.', error: null };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
};
