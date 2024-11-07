import { ObjectId } from 'mongodb';

import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import NotFoundError from '@utils/response/NotFoundError';
import HttpError from '@utils/response/HttpError';

export const DeleteSubmission = async (judge_id: string, team_id: string) => {
  try {
    const judge_object_id = new ObjectId(judge_id);
    const team_object_id = new ObjectId(team_id);
    const db = await getDatabase();

    const deleteStatus = await db.collection('submissions').deleteOne({
      judge_id: judge_object_id,
      team_id: team_object_id,
    });

    if (deleteStatus.deletedCount === 0) {
      throw new NotFoundError(
        `Submission with judge id: ${judge_id} and team id: ${team_id} not found.`
      );
    }

    return { ok: true, body: 'Submission deleted.', error: null };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
};
