import { NextResponse } from 'next/server';
import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import isBodyEmpty from '@utils/request/isBodyEmpty';
import parseAndReplace from '@utils/request/parseAndReplace';
import {
  NoContentError,
  HttpError,
} from '@utils/response/Errors';

export async function createUserToEvent(body: object) {
  try {
    console.log('Received body:', body);

    if (isBodyEmpty(body)) {
      console.log('Body is empty');
      throw new NoContentError();
    }

    const db = await getDatabase();
    console.log('Connected to database');

    const parsedBody = await parseAndReplace(body);
    console.log('Parsed body:', parsedBody);

    const currentDate = new Date().toISOString();
    const creationStatus = await db.collection('user_to_event').insertOne({
      ...parsedBody,
      _last_modified: currentDate,
      _created_at: currentDate,
    });
    console.log('Creation status:', creationStatus);

    const createdAssociation = await db.collection('user_to_event').findOne({
      _id: creationStatus.insertedId,
    });
    console.log('Created association:', createdAssociation);

    if (!createdAssociation) {
      console.log('Created association not found');
      throw new HttpError('Failed to fetch the created association');
    }

    // Returning a NextResponse directly
    return NextResponse.json(
      { ok: true, body: createdAssociation, error: null },
      { status: 201 }
    );

  } catch (e) {
    const error = e as HttpError;
    console.log('Error:', error.message);
    return NextResponse.json(
      { ok: false, body: null, error: error.message },
      { status: error.status || 400 }
    );
  }
};
