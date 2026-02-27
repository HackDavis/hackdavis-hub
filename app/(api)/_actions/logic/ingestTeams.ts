'use server';

import { CreateManyTeams } from '@datalib/teams/createTeams';
import ParsedRecord from '@typeDefs/parsedRecord';
import Team from '@typeDefs/team';

export default async function ingestTeams(body: ParsedRecord[]) {
  const res = await CreateManyTeams(body);

  if (!res.ok || !Array.isArray(res.body)) return res;

  const serializedBody = (res.body as Team[]).map((team) => ({
    ...team,
    _id: team._id ? String(team._id) : undefined,
  }));

  return {
    ...res,
    body: serializedBody,
  };
}
