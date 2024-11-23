'use server';

import { CreateManyTeams } from '@datalib/teams/createTeams';
import ParsedRecord from '@typeDefs/parsedRecord';

export default async function ingestCSV(parsedData: ParsedRecord[]) {
  const res = await CreateManyTeams(parsedData);
  return { ok: res.ok, error: res.error };
}
