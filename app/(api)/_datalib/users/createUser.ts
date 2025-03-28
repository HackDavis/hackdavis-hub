import { ObjectId } from 'mongodb';
import { hash } from 'bcryptjs';

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

    if (!parsedBody.password) {
      throw new HttpError('Missing password');
    }

    parsedBody.password = await hash(parsedBody.password, 10);

    const db = await getDatabase();

    // duplicate
    const existingUser = await db.collection('users').findOne({
      email: parsedBody.email,
    });
    if (existingUser) {
      throw new DuplicateError('Duplicate: user already exists.');
    }

    // admin
    if (parsedBody.role === 'admin') {
      const existingAdmin = await db.collection('users').findOne({
        role: 'admin',
      });

      if (existingAdmin) {
        throw new DuplicateError('Duplicate: admin already exists');
      }
    }

    // judge
    if (parsedBody.role === 'judge') {
      if (
        !Object.hasOwn(parsedBody, 'specialties') ||
        parsedBody.specialties.length === 0 ||
        parsedBody.has_checked_in
      ) {
        throw new HttpError(
          'Judge user is missing specialties or has has_checked_in set to true'
        );
      }
    }

    // hacker
    if (parsedBody.role === 'hacker') {
      if (
        !Object.hasOwn(parsedBody, 'position') ||
        !Object.hasOwn(parsedBody, 'is_beginner')
      ) {
        throw new HttpError('Hacker user is missing position or is_beginner');
      }
    }

    const creationStatus = await db.collection('users').insertOne(parsedBody);
    const user = await db.collection('users').findOne({
      _id: new ObjectId(creationStatus.insertedId),
    });

    return { ok: true, body: user, error: null };
  } catch (e) {
    const error = e as HttpError;
    return {
      ok: false,
      body: null,
      error: error.message,
    };
  }
};
