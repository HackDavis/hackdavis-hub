import { NextResponse } from 'next/server';
import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import { ObjectId } from 'mongodb';
import isBodyEmpty from '@utils/request/isBodyEmpty';
import parseAndReplace from '@utils/request/parseAndReplace';
import {
  HttpError,
  NoContentError,
  NotFoundError,
} from '@utils/response/Errors';

export const updateUserToEvent = async (userId: string, eventId: string, body: object) => {
  try {
    const user_id = new ObjectId(userId);
    const event_id = new ObjectId(eventId);
    
    // checks if empty
    if (isBodyEmpty(body)) {
      throw new NoContentError();
    }
    
    const parsedBody = await parseAndReplace(body);
    const db = await getDatabase();
    
    // Update user details if the user ID is provided
    const userUpdateResult = await db.collection('users').updateOne(
      { _id: user_id },
      { $set: parsedBody }
    );

    // Update event details if the event ID is provided
    const eventUpdateResult = await db.collection('events').updateOne(
      { _id: event_id },
      { $set: parsedBody }
    );

    // Check if either the user or event was updated
    if (userUpdateResult.matchedCount === 0 && eventUpdateResult.matchedCount === 0) {
      throw new NotFoundError(`No user with id: ${userId} or event with id: ${eventId} found.`);
    }

    // success resposnse
    return NextResponse.json(
      { ok: true, userUpdated: userUpdateResult.modifiedCount > 0, error: null },
      { status: 200 }
    );

    // catch block for errors
  } catch (e) {
    const error = e as HttpError;
    return NextResponse.json(
      { ok: false, body: null, error: error.message },
      { status: error.status || 400 }
    );
  }
};
