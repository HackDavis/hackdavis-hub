// DeleteUserToEvent function
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import NotFoundError from '@utils/response/NotFoundError';
import HttpError from '@utils/response/HttpError';

export const DeleteUserToEvent = async (query: object = {}) => {
  try {
    const db = await getDatabase();

    // Log query to see its structure + DELETE LATER
    console.log("Query being used for deletion:", query);

    // Perform delete operation based on the query object
    const deleteStatus = await db.collection('user-to-event').deleteMany(query);
    
    // delete
    console.log(deleteStatus);

    // If no documents matched the query, return a not-found message
    if (deleteStatus.deletedCount === 0) {
      throw new NotFoundError(`No matching associations found for the provided query.`);
    }

    // Confirmation response of deleted count
    return NextResponse.json(
      { ok: true, body: `${deleteStatus.deletedCount} association(s) deleted.`, error: null },
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