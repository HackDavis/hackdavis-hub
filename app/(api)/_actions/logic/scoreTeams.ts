'use server';

import { getManySubmissions } from '@actions/submissions/getSubmission';
import { getManyTeams } from '@actions/teams/getTeams';
import Submission from '@typeDefs/submission';
import Team from '@typeDefs/team';
import rankTeams from '@utils/scoring/rankTeams';

export default async function scoreTeams() {
  const teams: Team[] = (await getManyTeams()).body;
  const submissions: Submission[] = (await getManySubmissions(teams)).body;

  return rankTeams({ teams, submissions });
}
