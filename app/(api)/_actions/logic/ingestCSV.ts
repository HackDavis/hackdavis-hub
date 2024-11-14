'use server';

import { CreateManyTeams } from '@datalib/teams/createTeams';
import parsedRecordInt from '@typeDefs/parsedRecord';

export default async function ingestCSV(parsedData: parsedRecordInt[]) {
  const res = await CreateManyTeams(parsedData);
  return { ok: res.ok, error: res.error };
}
