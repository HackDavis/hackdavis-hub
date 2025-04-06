'use server';

import { UpdateTeam } from '@datalib/teams/updateTeam';
import { revalidatePath } from 'next/cache';

export async function updateTeam(id: string, body: object) {
  const updateRes = await UpdateTeam(id, { $set: body });
  revalidatePath('/');
  return updateRes;
}
