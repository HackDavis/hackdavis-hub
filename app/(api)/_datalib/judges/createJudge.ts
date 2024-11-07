import { ObjectId } from 'mongodb';
import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import isBodyEmpty from '@utils/request/isBodyEmpty';
import parseAndReplace from '@utils/request/parseAndReplace';
import {
  HttpError,
  NoContentError,
  DuplicateError,
} from '@utils/response/Errors';

export const CreateJudge = async (body: object) => {
  try {
    // empty
    if (isBodyEmpty(body)) {
      throw new NoContentError();
    }

    const parsedBody = await parseAndReplace(body);

    const db = await getDatabase();

    // duplicate
    const existingJudge = await db.collection('judges').findOne({
      email: parsedBody.email,
    });
    if (existingJudge) {
      throw new DuplicateError('Duplicate: judge already exists.');
    }
    const creationStatus = await db.collection('judges').insertOne(parsedBody);
    const judge = await db.collection('judges').findOne({
      _id: new ObjectId(creationStatus.insertedId),
    });

    return { ok: true, body: judge, error: null, status: 201 };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
};
