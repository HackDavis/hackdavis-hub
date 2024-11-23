import { ObjectId } from 'mongodb';
import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import isBodyEmpty from '@utils/request/isBodyEmpty';
import parseAndReplace from '@utils/request/parseAndReplace';
import {
  HttpError,
  NoContentError,
  DuplicateError,
} from '@utils/response/Errors';

export const CreateUser = async (body: object) => {
  try {
    // empty
    if (isBodyEmpty(body)) {
      throw new NoContentError();
    }

    const parsedBody = await parseAndReplace(body);

    const db = await getDatabase();

    // duplicate
    const existingUser = await db.collection('users').findOne({
      email: parsedBody.email,
    });
    if (existingUser) {
      throw new DuplicateError('Duplicate: user already exists.');
    }
    const creationStatus = await db.collection('users').insertOne(parsedBody);
    const user = await db.collection('users').findOne({
      _id: new ObjectId(creationStatus.insertedId),
    });

    return { ok: true, body: user, error: null, status: 201 };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
};
