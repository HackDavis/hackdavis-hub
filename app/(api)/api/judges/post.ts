import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import isBodyEmpty from '@utils/request/isBodyEmpty';
import parseAndReplace from '@utils/request/parseAndReplace';
import NoContentError from '@utils/response/NoContentError';
import HttpError from '@utils/response/HttpError';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (isBodyEmpty(body)) {
      throw new NoContentError();
    }
    if (body.judge_pair_id) {
      body.judge_pair_id = new ObjectId(body.judge_pair_id);
    }
    const parsedBody = await parseAndReplace(body);

    const db = await getDatabase();

    const creationStatus = await db.collection('judges').insertOne(parsedBody);

    const judge = await db.collection('judges').findOne({
      _id: new ObjectId(creationStatus.insertedId),
    });

    return NextResponse.json({ ok: true, body: judge }, { status: 201 });
  } catch (e) {
    const error = e as HttpError;
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 400 }
    );
  }
}
