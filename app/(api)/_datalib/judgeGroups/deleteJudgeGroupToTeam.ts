import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import { HttpError } from '@utils/response/Errors';

export const DeleteManyJudgeGroupsToTeams = async (query: object = {}) => {
  try {
    const db = await getDatabase();

    await db.collection('judgeGroupToTeams').deleteMany(query);

    return { ok: true, body: 'Judge Group to Teams deleted', error: null };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
};
