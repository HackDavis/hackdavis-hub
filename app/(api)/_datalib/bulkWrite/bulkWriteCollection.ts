import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import parseAndReplace from '@utils/request/parseAndReplace';
import HttpError from '@utils/response/HttpError';
import NoContentError from '@utils/response/NoContentError';

export const BulkWriteCollection = async (
  collection: string,
  operations: object[]
) => {
  try {
    if (operations.length === 0) throw new NoContentError();

    const parsedOperations = operations.map((operation) =>
      parseAndReplace(operation)
    );

    const db = await getDatabase();

    const res = await db.collection(collection).bulkWrite(parsedOperations);

    if (!res.acknowledged) throw new HttpError('Bulk write failed.');

    return { ok: true, body: res, error: null };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
};
