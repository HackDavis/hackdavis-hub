'use server';

import { GetManyTeams, GetTeam } from '@datalib/teams/getTeam';
import parseAndReplace from '@utils/request/parseAndReplace';
import { serializeMongoData } from '@utils/serialize/serialization';

export async function getTeam(id: string) {
  const team = await GetTeam(id);
  return serializeMongoData(team);
}

export async function getManyTeams(query: object = {}) {
  const newQuery = await parseAndReplace(query);
  const teams = await GetManyTeams(newQuery);
  return serializeMongoData(teams);
}
