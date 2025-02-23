'use server';

import { CreateUser } from '@datalib/users/createUser';

export async function createUser(body: object) {
  const response = await CreateUser(body);
  return response;
}
