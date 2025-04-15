import { ObjectId } from 'mongodb';

import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import isBodyEmpty from '@utils/request/isBodyEmpty';
import parseAndReplace from '@utils/request/parseAndReplace';
import {
  NoContentError,
  NotFoundError,
  HttpError,
} from '@utils/response/Errors';

export const UpdateSubmission = async (
  judge_id: string,
  team_id: string,
  body: object
) => {
  try {
    if (isBodyEmpty(body)) {
      throw new NoContentError();
    }
    const parsedBody = await parseAndReplace(body);

    const judge_object_id = new ObjectId(judge_id);
    const team_object_id = new ObjectId(team_id);
    const db = await getDatabase();

    const updateStatus = await db.collection('submissions').updateOne(
      {
        judge_id: judge_object_id,
        team_id: team_object_id,
      },
      parsedBody
    );

    if (updateStatus.matchedCount === 0) {
      throw new NotFoundError(
        `Submission with judge id: ${judge_id} and team id: ${team_id} not found.`
      );
    }

    return { ok: true, body: 'Submission updated.', error: null };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
};
