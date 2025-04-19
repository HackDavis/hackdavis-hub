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

export const CreateSubmission = async (body: any) => {
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

export const CreateManySubmissions = async (body: any[]) => {
  try {
    if (isBodyEmpty(body)) {
      throw new NoContentError();
    }

    const parsedBody = await parseAndReplace(body);

    const db = await getDatabase();

    const submissionsToInsert = [];

    for (const submission of parsedBody) {
      const { judge_id, team_id } = submission;

      // Check if judge exists and has role 'judge'
      const judge = await db.collection('users').findOne({
        _id: judge_id,
        role: 'judge',
      });
      if (!judge) {
        throw new NotFoundError(`Judge with id: ${judge_id} not found.`);
      }

      // Check if team exists
      const team = await db.collection('teams').findOne({
        _id: team_id,
      });
      if (!team) {
        throw new NotFoundError(`Team with id: ${team_id} not found.`);
      }

      // Check for duplicate submission
      const existingSubmission = await db.collection('submissions').findOne({
        judge_id,
        team_id,
      });
      if (existingSubmission) {
        throw new DuplicateError(
          `Submission already exists for judge ${judge_id} and team ${team_id}`
        );
      }

      submissionsToInsert.push({
        ...submission,
        social_good: null,
        creativity: null,
        presentation: null,
        scores: [],
        comments: '',
        is_scored: false,
        queuePosition: null,
      });
    }

    const creationStatus = await db
      .collection('submissions')
      .insertMany(submissionsToInsert);

    const insertedSubmissions = await db
      .collection('submissions')
      .find({
        _id: {
          $in: Object.values(creationStatus.insertedIds).map(
            (id: any) => new ObjectId(id)
          ),
        },
      })
      .toArray();

    return { ok: true, body: insertedSubmissions, error: null, status: 201 };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
};
