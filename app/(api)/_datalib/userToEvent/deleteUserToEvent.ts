// DeleteUserToEvent function
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import NotFoundError from '@utils/response/NotFoundError';
import HttpError from '@utils/response/HttpError';

export const DeleteUserToEvent = async (id: string) => {
  try {
    const db = await getDatabase();
    const object_id = new ObjectId(id);

    // TESTING PURPOSES: Log query to see its structure + DELETE LATER
    console.log('Query being used for deletion:', id);

    // Perform delete operation based on the query object
    const deleteStatus = await db
      .collection('user_to_event')
      .deleteOne({ _id: object_id });

    const findStatus = await db
      .collection('user_to_event')
      .findOne({ _id: object_id });

    console.log('FOUND', findStatus);

    // TESTING PURPOSES: delete later
    console.log(deleteStatus);

    // If no documents matched the query, return a not-found message
    if (deleteStatus.deletedCount === 0) {
      throw new NotFoundError(
        `No matching associations found for the provided query.`
      );
    }

    // Confirmation response of deleted count
    return NextResponse.json(
      {
        ok: true,
        body: `${deleteStatus.deletedCount} association(s) deleted.`,
        error: null,
      },
      { status: 200 }
    );
  } catch (e) {
    const error = e as HttpError;
    return NextResponse.json(
      { ok: false, body: null, error: error.message },
      { status: error.status || 400 }
    );
  }
};
