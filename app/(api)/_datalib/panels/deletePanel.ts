import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import { ObjectId } from 'mongodb';
import { HttpError, NotFoundError } from '@utils/response/Errors';

export const DeleteManyPanels = async (query: object = {}) => {
  try {
    const db = await getDatabase();

    const result = await db.collection('panels').deleteMany(query);

    if (result.deletedCount === 0) {
      throw new HttpError('Failed to delete panels');
    }

    return {
      ok: true,
      body: `${result.deletedCount} panels successfully deleted`,
      error: null,
    };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
};

export const DeletePanel = async (id: string) => {
  try {
    const db = await getDatabase();

    const panel = await db
      .collection('panels')
      .findOne({ _id: new ObjectId(id) });
    if (!panel) {
      throw new NotFoundError(`Panel with id ${id} not found`);
    }

    const result = await db
      .collection('panels')
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      throw new HttpError('Failed to delete panel');
    }

    return {
      ok: true,
      body: `Panel for ${panel.track} successfully deleted`,
      error: null,
    };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
};
