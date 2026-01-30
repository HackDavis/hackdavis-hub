'use server';

import { CreateManyTeams } from '@datalib/teams/createTeams';
import ParsedRecord from '@typeDefs/parsedRecord';

export default async function ingestTeams(body: ParsedRecord[]) {
  return CreateManyTeams(body);
}
