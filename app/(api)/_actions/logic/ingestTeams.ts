"use server";

import { CreateManyTeams } from "@datalib/teams/createTeams";

export default async function ingestTeams(body: object) {
  return CreateManyTeams(body);
}
