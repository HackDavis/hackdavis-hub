'use server';
import { GetUser, GetManyUsers } from '@datalib/users/getUser';

export async function getUser(id: string) {
  const userRes = await GetUser(id);
  return userRes;
}

export async function getManyUsers(query: object = {}) {
  const userRes = await GetManyUsers(query);
  return userRes;
}
