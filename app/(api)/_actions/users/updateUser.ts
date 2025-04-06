'use server';

import { revalidatePath } from 'next/cache';
import { UpdateUser } from '@datalib/users/updateUser';

export async function updateUser(id: string, body: object) {
  const response = await UpdateUser(id, body);
  revalidatePath('/');
  return response;
}
