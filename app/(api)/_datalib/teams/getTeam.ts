import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import { HttpError, NotFoundError } from '@utils/response/Errors';
import { ObjectId } from 'mongodb';

export const GetTeam = async (id: string) => {
  try {
    const object_id = new ObjectId(id);
    const db = await getDatabase();
    const team = await db.collection('teams').findOne({
      _id: object_id,
    });

    if (team === null) {
      throw new NotFoundError(`Team with id: ${id} not found.`);
    }

    return { ok: true, body: team, error: null };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
};

export const GetManyTeams = async (query: object = {}) => {
  try {
    const db = await getDatabase();
    const teams = await db
      .collection('teams')
      .aggregate([
        {
          $match: query,
        },
        {
          $lookup: {
            from: 'submissions',
            localField: '_id',
            foreignField: 'team_id',
            as: 'submissions',
          },
        },
      ])
      .project({
        'submissions.team_id': 0,
      })
      .toArray();

    return { ok: true, body: teams, error: null };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
};
