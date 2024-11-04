// GetUserToEvent.ts
import { NextResponse } from 'next/server';
import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import { HttpError } from '@utils/response/Errors';
import { ObjectId } from 'mongodb';

export const GetUserToEvent = async (query: object = {}) => {
  try {
    const db = await getDatabase();

    const userEvents = await db.collection('user_to_event').aggregate([
      {
        $match: query,
      },
      {
        $lookup: {
          from: 'events',           // Your events collection name
          localField: 'event_id',
          foreignField: '_id',
          as: 'events',             // Change from 'judgeGroups' to 'events'
        },
      },
      {
        $lookup: {
          from: 'users',            // Your users collection name
          localField: 'user_id',
          foreignField: '_id',
          as: 'users',              // Change from 'teams' to 'users'
        },
      },
    ]).toArray();

    return NextResponse.json(
      { ok: true, body: userEvents, error: null },
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
