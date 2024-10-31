import { NextResponse } from 'next/server';
import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import { HttpError, NotFoundError } from '@utils/response/Errors';
import { ObjectId } from 'mongodb';

export const GetUserToEvent = async (id: string, idType: 'user_id' | 'event_id') => {
  try {
    // Validate and set up the query based on the id type
    const object_id = new ObjectId(id);
    const db = await getDatabase();
    const query = idType === 'user_id' ? { user_id: object_id } : { event_id: object_id };

    const association = await db.collection('user_to_event').findOne(query);

    // if associate for given id type doesnt exist, then error
    if (!association) {
      throw new NotFoundError(`Association with ${idType}: ${id} not found.`);
    }

    // success response
    return NextResponse.json(
      { ok: true, body: association, error: null },
      { status: 200 }
    );

  // catch block for error handling
  } catch (e) {
    const error = e as HttpError;
    return NextResponse.json(
      { ok: false, body: null, error: error.message },
      { status: error.status || 400 }
    );
  }
};
