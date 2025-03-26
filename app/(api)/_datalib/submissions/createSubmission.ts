import { ObjectId } from 'mongodb';

import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import isBodyEmpty from '@utils/request/isBodyEmpty';
import parseAndReplace from '@utils/request/parseAndReplace';
import {
  NoContentError,
  NotFoundError,
  DuplicateError,
  HttpError,
} from '@utils/response/Errors';

export const CreateSubmission = async (body: {
  judge_id: object;
  team_id: object;
}) => {
  try {
    if (isBodyEmpty(body)) {
      throw new NoContentError();
    }
    const parsedBody = await parseAndReplace(body);
    const db = await getDatabase();

    const judge = await db.collection('users').findOne({
      _id: parsedBody.judge_id,
      role: 'judge',
    });
    if (judge === null) {
      throw new NotFoundError(`judge with id: ${body.judge_id} not found.`);
    }

    const team = await db.collection('teams').findOne({
      _id: parsedBody.team_id,
    });
    if (team === null) {
      throw new NotFoundError(`team with id: ${body.team_id} not found.`);
    }

    const existingSubmission = await db.collection('submissions').findOne({
      judge_id: parsedBody.judge_id,
      team_id: parsedBody.team_id,
    });
    if (existingSubmission) {
      throw new DuplicateError('Submission already exists');
    }

    const creationStatus = await db.collection('submissions').insertOne({
      ...parsedBody,
      social_good: null,
      creativity: null,
      presentation: null,
      scores: [],
      comments: '',
      is_scored: false,
      queuePosition: null,
    });
    const submission = await db.collection('submissions').findOne({
      _id: new ObjectId(creationStatus.insertedId),
    });

    return { ok: true, body: submission, error: null };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
};
