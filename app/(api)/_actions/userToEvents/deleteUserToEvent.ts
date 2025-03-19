'use server';

import { DeleteUserToEvent } from '@datalib/userToEvents/deleteUserToEvent';
import parseAndReplace from '@utils/request/parseAndReplace';

export default async function deleteUserToEvent(query: object = {}) {
  const newQuery = await parseAndReplace(query);
  await DeleteUserToEvent(newQuery);
}
