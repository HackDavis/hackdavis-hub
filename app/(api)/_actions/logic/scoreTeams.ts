"use server";

import { getManyTeams } from "@actions/teams/getTeams";
import Team from "@typeDefs/team";
import rankTeams from "@utils/scoring/rankTeams";

export default async function scoreTeams() {
  const teams: Team[] = (await getManyTeams()).body;
  return rankTeams(teams);
}
