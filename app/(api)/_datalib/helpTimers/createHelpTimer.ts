import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import isBodyEmpty from '@utils/request/isBodyEmpty';
import { HttpError, NoContentError } from '@utils/response/Errors';

export const CreateHelpTimer = async (body: object) => {
  try {
    // empty
    if (isBodyEmpty(body)) {
      throw new NoContentError();
    }

    const db = await getDatabase();

    const creationStatus = await db.collection('helpTimers').insertOne(body);
    const helpTimer = await db.collection('helpTimers').findOne({
      _id: new ObjectId(creationStatus.insertedId),
    });

    return NextResponse.json(
      { ok: true, body: helpTimer, error: null },
      { status: 201 }
    );
  } catch (e) {
    const error = e as HttpError;
    return NextResponse.json(
      { ok: false, body: null, error: error.message },
      { status: error.status || 400 }
    );
  }
};
