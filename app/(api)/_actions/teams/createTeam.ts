'use server';

import { CreateManyTeams } from '@datalib/teams/createTeams';
import { revalidatePath } from 'next/cache';

export async function createTeam(body: object) {
  const createdTeam = await CreateManyTeams([body]);
  revalidatePath('/');
  return createdTeam;
}
