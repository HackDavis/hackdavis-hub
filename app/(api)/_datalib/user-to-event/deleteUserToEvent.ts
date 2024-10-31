import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import NotFoundError from '@utils/response/NotFoundError';
import HttpError from '@utils/response/HttpError';

// take in string of object_id (association id) to delete 
export const DeleteUserToEvent = async (id: string) => {
  try {
    // just renames id to object_id 
    const object_id = new ObjectId(id);
    const db = await getDatabase();

    // delete association
    const deleteStatus = await db.collection('user-to-event').deleteOne({
      _id: object_id,
    });

    // if can't find doc to delete, show error
    if (deleteStatus.deletedCount === 0) {
      throw new NotFoundError(`Association with id: ${id} not found.`);
    }

    // confirmation of deletion
    return NextResponse.json(
      { ok: true, body: 'Association deleted.', error: null },
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
