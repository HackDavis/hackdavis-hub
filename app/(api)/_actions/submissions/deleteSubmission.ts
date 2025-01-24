'use server';

import { DeleteManySubmissions } from '@datalib/submissions/deleteSubmission';
import parseAndReplace from '@utils/request/parseAndReplace';

export default async function deleteManySubmissions(query: object = {}) {
  const newQuery = await parseAndReplace(query);
  await DeleteManySubmissions(newQuery);
}
