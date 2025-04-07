'use server';

import { BulkWriteCollection } from '@datalib/bulkWrite/bulkWriteCollection';

export default async function bulkWriteCollection(
  collection: string,
  operations: object[]
) {
  return BulkWriteCollection(collection, operations);
}
