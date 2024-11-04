import { ObjectId } from 'mongodb';
import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import isBodyEmpty from '@utils/request/isBodyEmpty';
import parseAndReplace from '@utils/request/parseAndReplace';
import {
  HttpError,
  NotFoundError,
  NoContentError,
} from '@utils/response/Errors';

export const UpdateJudge = async (id: string, body: object) => {
  try {
    const object_id = new ObjectId(id);
    if (isBodyEmpty(body)) {
      throw new NoContentError();
    }

    const parsedBody = await parseAndReplace(body);

    const db = await getDatabase();

    const judge = await db.collection('judges').updateOne(
      {
        _id: object_id,
      },
      parsedBody
    );

    if (judge === null) {
      throw new NotFoundError(`Judge with id: ${id} not found.`);
    }

    return { ok: true, body: judge, error: null };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
};
