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
    if (isBodyEmpty(body)) {
      throw new NoContentError();
    }

    // general stuff
    const db = await getDatabase();
    const parsedBody = await parseAndReplace(body);
    const currentDate = new Date().toISOString();

    // adds new document into user_to_event collection (?)
    const creationStatus = await db.collection('user_to_event').insertOne({
      ...parsedBody,
      _last_modified: currentDate,
      _created_at: currentDate,
    });

    // finds a document in user_to_event collection given insertedId from crerationStatus
    const createdAssociation = await db.collection('user_to_event').findOne({
      _id: creationStatus.insertedId,
    });

    // error if document dne
    if (!createdAssociation) {
      throw new HttpError('Failed to fetch the created association');
    }

    // success response
    return { ok: true, body: createdAssociation, error: null };

    // catch block for error handling
  } catch (e) {
    const error = e as HttpError;
    return NextResponse.json(
      { ok: false, body: null, error: error.message },
      { status: error.status || 400 }
    );
  }
};
