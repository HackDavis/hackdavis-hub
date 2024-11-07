'use server';

import { GetManyTeams, GetTeam } from '@datalib/teams/getTeam';
import parseAndReplace from '@utils/request/parseAndReplace';

export async function getTeam(id: string) {
  const team = await GetTeam(id);
  return team;
}

export async function getManyTeams(query: object = {}) {
  const newQuery = await parseAndReplace(query);
  const teams = await GetManyTeams(newQuery);
  return teams;
}
