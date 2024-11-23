import { ObjectId } from 'mongodb';

import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import isBodyEmpty from '@utils/request/isBodyEmpty';
import {
  NoContentError,
  NotFoundError,
  DuplicateError,
  HttpError,
} from '@utils/response/Errors';

export const LinkUserToEvent = async (body: {
  user_id: string;
  event_id: string;
}) => {
  try {
    if (isBodyEmpty(body)) {
      throw new NoContentError();
    }

    const parsedBody = {
      user_id: new ObjectId(body.user_id),
      event_id: new ObjectId(body.event_id),
    };

    const db = await getDatabase();

    const user = await db.collection('users').findOne({
      _id: parsedBody.user_id,
    });
    if (user === null) {
      throw new NotFoundError(`user with id: ${body.user_id} not found.`);
    }

    const event = await db.collection('events').findOne({
      _id: parsedBody.event_id,
    });
    if (event === null) {
      throw new NotFoundError(`event with id: ${body.event_id} not found.`);
    }

    const existingUserToEvent = await db.collection('userToEvents').findOne({
      user_id: parsedBody.user_id,
      event_id: parsedBody.event_id,
    });
    if (existingUserToEvent) {
      throw new DuplicateError('UserToEvent already exists');
    }

    const creationStatus = await db
      .collection('userToEvents')
      .insertOne(parsedBody);
    const userToEvent = await db.collection('userToEvents').findOne({
      _id: new ObjectId(creationStatus.insertedId),
    });

    return { ok: true, body: userToEvent, error: null, status: 201 };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
};
