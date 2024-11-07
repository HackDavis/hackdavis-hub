'use server';

import { CreateManyTeams } from '@datalib/teams/createTeams';
import parsedRecord from '@typeDefs/parsedRecord';

export default async function ingestCSV(parsedData: parsedRecord[]) {
  const res = await CreateManyTeams(parsedData);
  return { ok: res.ok, error: res.error };
}
