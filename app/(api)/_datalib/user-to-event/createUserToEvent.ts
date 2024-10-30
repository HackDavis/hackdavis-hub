import { NextResponse } from 'next/server';
import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import isBodyEmpty from '@utils/request/isBodyEmpty';
import parseAndReplace from '@utils/request/parseAndReplace';
import {
  NoContentError,
  HttpError,
  BadRequestError,
  DuplicateError,
} from '@utils/response/Errors';

export async function createUserToEvent(body: object) {
  try {
    if (isBodyEmpty(body)) {
      throw new NoContentError();
    }

    // ok after this
    const db = await getDatabase();

/*     const seenNumbers = new Set();
    const teamNumbers = parsedBody.map((team: { number: number }) => {
      if (seenNumbers.has(team.number)) {
        throw new DuplicateError('Request contains duplicate team number(s)');
      }
      seenNumbers.add(team.number);
      return team.number;
    }); */

    const parsedBody = await parseAndReplace(body);
    const currentDate = new Date().toISOString();

    const creationStatus = await db.collection('user_to_event').insertOne({
      ...parsedBody,
      _last_modified: currentDate,
      _created_at: currentDate,
    });

    const createdAssociation = await db.collection('user_to_event').findOne({
      _id: creationStatus.insertedId,
    });

    if (!createdAssociation) {
      throw new HttpError('Failed to fetch the created association');
    }

    return { ok: true, body: createdAssociation, error: null };
  } catch (e) {
    const error = e as HttpError;
    return NextResponse.json(
      { ok: false, body: null, error: error.message },
      { status: error.status || 400 }
    );
  }
};
